/**
 * ShaderGradient — WebGL 流动渐变背景（"做实"质感升级）
 *
 * 阶段 C 核心：原生 WebGL fragment shader 绘制流动渐变 + 噪声扰动
 *   - 替换 CSS AuroraBackground（CSS radial-gradient 容易看出"塑料感"）
 *   - 用 fragment shader 生成更自然的"光雾"，加入 fbm 噪声扰动避免渐变带
 *   - 低饱和度品牌蓝 + 紫色，缓慢漂移（30s 周期，几乎不察觉）
 *   - 不引入 Three.js（节省 ~175KB bundle），仅 ~3KB 原生 WebGL
 *
 * 降级策略：
 *   - 移动端 / 低端设备：不渲染（保留父组件的 fallback）
 *   - reduced motion：渲染首帧后停止动画（uTime 不更新）
 *   - WebGL 不可用：返回 null（父组件应提供 fallback）
 *
 * 性能：
 *   - 单一全屏 quad + fragment shader，GPU 开销极低
 *   - uTime 每帧更新（rAF），但 shader 计算量很小
 *   - 页面隐藏时自动暂停（visibilitychange）
 */

import { useEffect, useRef, useState } from "react";
import { getDevicePerformanceProfile, observeVisibilityChange } from "@/lib/perf";

export interface ShaderGradientProps {
  /** 主色（vec3，0-1），默认品牌蓝 [0.08, 0.69, 1.0] */
  primaryColor?: [number, number, number];
  /** 副色（vec3，0-1），默认紫色 [0.66, 0.33, 0.97] */
  secondaryColor?: [number, number, number];
  /** 背景基色（vec3，0-1），默认深黑蓝 [0.02, 0.03, 0.06] */
  backgroundColor?: [number, number, number];
  /** 整体不透明度，默认 0.18 */
  opacity?: number;
  /** 动画速度，默认 0.04（很慢，30s+ 周期） */
  speed?: number;
  /** 噪声强度，默认 0.5（控制渐变带扰动程度） */
  noiseStrength?: number;
  className?: string;
}

const VERT_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Fragment shader：流动渐变 + fbm 噪声扰动
// 参考：Shadertoy 经典 fbm noise + gradient mix
const FRAG_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_primary;
uniform vec3 u_secondary;
uniform vec3 u_bg;
uniform float u_noiseStrength;
uniform float u_speed;

// hash & noise（IQ 的经典实现）
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// fbm：4 层叠加
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  // 归一化到 [-1, 1]，并以短边为基准（避免拉伸时变形）
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // 缓慢漂移
  float t = u_time * u_speed;
  vec2 q = vec2(
    fbm(p * 0.8 + vec2(t * 0.3, t * 0.2)),
    fbm(p * 0.8 + vec2(-t * 0.2, t * 0.4) + 5.2)
  );

  // 第二层 fbm，让光雾更自然
  float n = fbm(p * 1.5 + q * 2.0 + vec2(t * 0.5, t * 0.3));
  n = smoothstep(0.2, 0.9, n);

  // 三段渐变：bg → primary → secondary
  vec3 color = mix(u_bg, u_primary, n);
  color = mix(color, u_secondary, smoothstep(0.6, 1.0, n) * 0.5);

  // 微弱噪声扰动（避免渐变带"塑料感"）
  float grain = (hash(gl_FragCoord.xy + t) - 0.5) * u_noiseStrength * 0.06;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[ShaderGradient] shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vert = createShader(gl, gl.VERTEX_SHADER, VERT_SHADER);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("[ShaderGradient] program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function ShaderGradient({
  primaryColor = [0.08, 0.69, 1.0],
  secondaryColor = [0.66, 0.33, 0.97],
  backgroundColor = [0.02, 0.03, 0.06],
  opacity = 0.18,
  speed = 0.04,
  noiseStrength = 0.5,
  className = "",
}: ShaderGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported, setSupported] = useState(true);
  const [profile, setProfile] = useState(getDevicePerformanceProfile());

  // 设备性能检测（窗口尺寸变化时重新评估）
  useEffect(() => {
    const update = () => setProfile(getDevicePerformanceProfile());
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // WebGL 渲染主循环
  useEffect(() => {
    // 移动端 / 低端设备 / reduced motion：不启用 WebGL
    if (profile.isMobile || profile.tier === "low") {
      setSupported(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("[ShaderGradient] WebGL not supported");
      setSupported(false);
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      setSupported(false);
      return;
    }

    // 全屏 quad（两个三角形覆盖整个视口）
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // uniform 句柄
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPrimary = gl.getUniformLocation(program, "u_primary");
    const uSecondary = gl.getUniformLocation(program, "u_secondary");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uNoiseStrength = gl.getUniformLocation(program, "u_noiseStrength");
    const uSpeed = gl.getUniformLocation(program, "u_speed");

    gl.useProgram(program);

    // resize 处理
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // 静态 uniform
    gl.uniform3fv(uPrimary, primaryColor);
    gl.uniform3fv(uSecondary, secondaryColor);
    gl.uniform3fv(uBg, backgroundColor);
    gl.uniform1f(uNoiseStrength, noiseStrength);
    gl.uniform1f(uSpeed, speed);

    // 动画循环
    let rafId: number | null = null;
    let isVisible = true;
    let startTime = performance.now();
    let pausedAt = 0;

    const render = () => {
      const time = (performance.now() - startTime) / 1000;
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    // 页面隐藏时暂停（节省 GPU）
    const unobserve = observeVisibilityChange((hidden) => {
      if (hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
          pausedAt = performance.now();
        }
        isVisible = false;
      } else if (!isVisible) {
        // 恢复时调整 startTime，让动画从暂停处继续
        const pausedDuration = performance.now() - pausedAt;
        startTime += pausedDuration;
        isVisible = true;
        if (rafId === null) {
          rafId = requestAnimationFrame(render);
        }
      }
    });

    // reduced motion：渲染一帧后停止
    if (profile.reducedMotion) {
      gl.uniform1f(uTime, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      unobserve();
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
    };
  }, [
    profile.isMobile,
    profile.tier,
    profile.reducedMotion,
    primaryColor,
    secondaryColor,
    backgroundColor,
    noiseStrength,
    speed,
  ]);

  // 不支持的设备：不渲染（父组件应提供 fallback）
  if (!supported || profile.isMobile || profile.tier === "low") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity, pointerEvents: "none" }}
    />
  );
}
