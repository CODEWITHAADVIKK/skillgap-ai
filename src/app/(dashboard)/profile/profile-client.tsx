"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { updateProfileInfo } from "@/lib/actions/profile";

interface ProfileClientProps {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    profile?: {
      dreamRole?: string | null;
      country?: string | null;
      city?: string | null;
      remote?: boolean;
      expectedSalary?: number | null;
      experienceLevel?: string | null;
      careerReadinessScore?: number | null;
      skillGapScore?: number | null;
      resumeHealth?: number | null;
      atsScore?: number | null;
      githubHealth?: number | null;
      onboardingStep?: number;
      onboardingComplete?: boolean;
    } | null;
    githubProfile?: {
      githubUsername: string;
      avatarUrl?: string | null;
      bio?: string | null;
      publicRepos: number;
      followers: number;
      contributionData?: Record<string, unknown> | null;
      languages?: Record<string, number> | null;
      repositories?: {
        name: string;
        stars: number;
      }[];
    } | null;
    skillGaps?: {
      skill: { name: string };
      priority: string;
      whyItMatters?: string | null;
    }[];
    projects?: {
      title: string;
      status: string;
    }[];
    resumes?: {
      fileUrl: string;
      fileName: string;
      parsedData?: { 
        skills?: string[]; 
        education?: { institution?: string; degree?: string; field?: string }[];
        [key: string]: unknown;
      } | null;
    }[];
    learningProgress?: {
      title: string;
      progress: number;
      completed: boolean;
      createdAt: string;
    }[];
    interviewSessions?: {
      createdAt: string;
      score?: number | null;
    }[];
  };
}

// Three.js Mentor Canvas Component
const ThreeJSOrb = ({ threeLoaded }: { threeLoaded: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!threeLoaded || !(window as any).THREE) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const THREE = (window as any).THREE;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 250;
    const height = container.clientHeight || 150;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    // Main body
    const bodyGeo = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x6D5DF6, 
        transparent: true, 
        opacity: 0.8,
        shininess: 100 
    });
    const body = new THREE.Mesh(bodyGeo, material);
    group.add(body);

    // Outer ring
    const ringGeo = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xEC4899, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    scene.add(group);
    camera.position.z = 5;

    let animationFrameId: number;

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        
        group.position.y = Math.sin(time) * 0.2;
        group.rotation.y += 0.01;
        ring.rotation.z = time * 0.5;
        
        renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, [threeLoaded]);

  return <div ref={containerRef} className="w-full h-full" />;
};

// WebGL Background Component
const WebGLBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;

    function syncSize() {
      const w = canvas.clientWidth  || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
      }
    }
    
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!glContext) return;
    const gl = glContext as WebGLRenderingContext;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
v_texCoord = a_position * 0.5 + 0.5;
gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = v_texCoord;
  
  // Background color (very light lavender/white)
  vec3 color1 = vec3(0.98, 0.98, 1.0); // #FAFAFF
  vec3 color2 = vec3(0.93, 0.92, 1.0); // Soft purple tint
  vec3 color3 = vec3(1.0, 0.95, 0.98); // Soft pink tint
  
  // Create soft, flowing organic motion
  float noise = sin(uv.x * 3.0 + u_time * 0.5) * cos(uv.y * 2.0 + u_time * 0.4);
  noise += sin(uv.y * 4.0 - u_time * 0.6) * cos(uv.x * 5.0 + u_time * 0.3);
  
  float mixFactor = clamp(noise * 0.5 + 0.5, 0.0, 1.0);
  vec3 finalColor = mix(color1, color2, mixFactor * 0.3);
  finalColor = mix(finalColor, color3, (1.0 - mixFactor) * 0.1);
  
  gl_FragColor = vec4(finalColor, 1.0);
}`;

    function compileShader(type: number, src: string) {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    function render(t: number) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40" style={{ display: 'block' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export function ProfileClient({ user }: ProfileClientProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Modal form states
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [dreamRole, setDreamRole] = useState(user.profile?.dreamRole || "");
  const [city, setCity] = useState(user.profile?.city || "");
  const [country, setCountry] = useState(user.profile?.country || "");
  const [experienceLevel, setExperienceLevel] = useState(user.profile?.experienceLevel || "");

  // Parse resume data
  const latestResume = user.resumes?.[0];
  const parsedData = latestResume?.parsedData;
  const resumeSkills = parsedData?.skills || [];
  const githubLangs = Object.keys(user.githubProfile?.languages || {});
  
  // Combine all skills
  const allSkills = Array.from(new Set([...resumeSkills, ...githubLangs]));
  const displaySkills = allSkills.length > 0 
    ? allSkills.slice(0, 12) 
    : ["Python", "Java", "C++", "React", "Node.js", "JavaScript", "Tailwind CSS", "MongoDB", "Git", "Docker"];

  // Skill chips interactive state
  const [selectedSkills, setSelectedSkills] = useState<string[]>(displaySkills.slice(0, 3));

  // Three.js loading state
  const [threeLoaded, setThreeLoaded] = useState(false);

  // Compute profile completion dynamically based on populated fields
  const fields = [
    user.firstName,
    user.lastName,
    user.profile?.dreamRole,
    user.profile?.city,
    user.profile?.country,
    user.profile?.experienceLevel,
    user.resumes?.length ? "resume" : null,
    user.githubProfile ? "github" : null,
  ];
  const filledFieldsCount = fields.filter(Boolean).length;
  const completionProgress = Math.round((filledFieldsCount / fields.length) * 100);

  const handleChipClick = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateProfileInfo({
          firstName,
          lastName,
          dreamRole,
          city,
          country,
          experienceLevel,
        });
        setIsEditOpen(false);
      } catch (err) {
        console.error(err);
      }
    });
  };

  // GitHub stars calculation
  const githubStars = user.githubProfile?.repositories?.reduce((acc, r) => acc + (r.stars || 0), 0) || 42;





  // Skill match ring math
  const readinessScore = user.profile?.careerReadinessScore || 72;
  const strokeDashoffset = 100 - readinessScore;

  // Skill gap counts
  const strongCount = resumeSkills.length || 12;
  const avgCount = githubLangs.length || 8;
  const weakCount = user.skillGaps?.filter(g => g.priority === "medium").length || 6;
  const missingCount = user.skillGaps?.filter(g => g.priority === "high" || g.priority === "critical").length || 4;

  return (
    <>
      {/* Script to load Three.js via CDN */}
      <Script 
        src="https://ajax.googleapis.com/ajax/libs/threejs/r125/three.min.js" 
        strategy="lazyOnload" 
        onLoad={() => setThreeLoaded(true)}
      />

      {/* Animated WebGL Shader Background */}
      <WebGLBackground />

      {/* Top Navbar */}
      <header className="sticky top-0 right-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm flex justify-between items-center h-16 px-6 lg:px-10 mb-8 rounded-[24px]">
        <div className="flex items-center gap-4">
          <nav className="flex gap-6 items-center">
            <Link className="text-on-surface-variant font-medium hover:text-primary transition-colors" href="/dashboard">Dashboard</Link>
            <span className="text-primary font-bold border-b-2 border-primary pb-1">Profile</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {latestResume ? (
            <a 
              href={latestResume.fileUrl} 
              download
              className="flex items-center gap-2 px-4 py-2 border border-outline text-primary rounded-xl font-label-md hover:bg-primary/5 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Download Resume
            </a>
          ) : (
            <Link 
              href="/onboarding?step=3"
              className="flex items-center gap-2 px-4 py-2 border border-outline text-primary rounded-xl font-label-md hover:bg-primary/5 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[20px]">upload</span>
              Upload Resume
            </Link>
          )}
          <button 
            onClick={() => setIsEditOpen(true)}
            className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm font-medium"
          >
            Edit Profile
          </button>
          <div className="flex items-center gap-2 ml-4">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Image
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" 
              alt="Avatar" 
              src={user.imageUrl || "/avatars/placeholder.png"} 
            />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 fade-in-stagger">
        
        {/* Left Column: Hero Profile Card */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-[24px] overflow-hidden card-shadow h-fit">
          <div className="h-32 bg-gradient-to-br from-primary via-secondary to-tertiary relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="glass-badge px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Verified
              </span>
            </div>
          </div>
          <div className="px-6 pb-6 -mt-16 relative">
            <div className="relative w-32 h-32 group">
              <Image
                width={128}
                height={128}
                className="w-full h-full rounded-full border-4 border-surface-container-lowest object-cover shadow-xl" 
                alt="Avatar" 
                src={user.imageUrl || "/avatars/placeholder.png"} 
              />
              <div 
                onClick={() => setIsEditOpen(true)}
                className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full border-2 border-surface-container-lowest flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">{user.firstName} {user.lastName}</h2>
              <span className="inline-block px-3 py-1 bg-surface-container rounded-full text-primary text-label-md mt-1">
                {user.profile?.dreamRole || "Computer Science Student"}
              </span>
              <p className="mt-4 text-on-surface-variant text-body-md leading-relaxed">
                {user.githubProfile?.bio || "Passionate about building impactful solutions and bridging the gap between learning and real-world skills. Specializing in Full-stack development and AI integration."}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <span className="text-body-md font-medium truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <span className="text-body-md font-medium">
                  {user.profile?.city && user.profile?.country 
                    ? `${user.profile.city}, ${user.profile.country}` 
                    : "Bhopal, India"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <span className="text-body-md font-medium">
                  {parsedData?.education?.[0]?.institution || "RGPV University"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <span className="text-body-md font-medium">
                  {user.githubProfile?.githubUsername 
                    ? `github.com/${user.githubProfile.githubUsername}` 
                    : "github.com/krishnatomar"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile details */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Profile Completion */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">data_usage</span>
                <h3 className="font-headline-md text-headline-md">Profile Completion</h3>
              </div>
              <span className="text-primary font-bold text-headline-md">{completionProgress}%</span>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(109,93,246,0.4)] transition-all duration-1000 ease-out"
                style={{ width: `${completionProgress}%` }}
              />
            </div>
            <p className="mt-4 text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">info</span>
              {completionProgress < 100 
                ? "Almost there! Complete your details to reach 100% completion."
                : "Looking perfect! Your profile analysis is fully operational."}
            </p>
          </div>

          {/* Stats Grid Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-4 card-shadow hover:-translate-y-1 transition-transform">
              <span className="text-on-surface-variant text-label-sm block mb-2 font-bold uppercase tracking-wider">Skill Gap Score</span>
              <div className="flex items-end gap-1">
                <span className="text-headline-xl font-bold text-on-surface">{user.profile?.skillGapScore || 86}</span>
                <span className="text-on-surface-variant mb-1">/100</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-green-600 font-bold text-[12px]">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                Strong Progress
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-4 card-shadow hover:-translate-y-1 transition-transform">
              <span className="text-on-surface-variant text-label-sm block mb-2 font-bold uppercase tracking-wider">Projects Built</span>
              <div className="flex items-end gap-1">
                <span className="text-headline-xl font-bold text-on-surface">{user.projects?.length || 6}</span>
                <span className="text-on-surface-variant mb-1">Total</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-tertiary font-bold text-[12px]">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                Keep building!
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-4 card-shadow hover:-translate-y-1 transition-transform">
              <span className="text-on-surface-variant text-label-sm block mb-2 font-bold uppercase tracking-wider">Courses Done</span>
              <div className="flex items-end gap-1">
                <span className="text-headline-xl font-bold text-on-surface">
                  {user.learningProgress?.filter(p => p.completed).length || 12}
                </span>
                <span className="text-on-surface-variant mb-1">/28</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-primary font-bold text-[12px]">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                Dynamic Progress
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-4 card-shadow hover:-translate-y-1 transition-transform">
              <span className="text-on-surface-variant text-label-sm block mb-2 font-bold uppercase tracking-wider">Assessments</span>
              <div className="flex items-end gap-1">
                <span className="text-headline-xl font-bold text-on-surface">{user.interviewSessions?.length || 18}</span>
                <span className="text-on-surface-variant mb-1">/25</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-secondary font-bold text-[12px]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Attempted
              </div>
            </div>
          </div>

          {/* Bento Box: Analysis & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skill Gap Analysis */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline-md text-headline-md">Skill Gap Analysis</h3>
                <Link className="text-primary font-bold text-label-md hover:underline" href="/gap-analysis">View report</Link>
              </div>
              <div className="flex items-center gap-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="none" r="16" stroke="#ECECFA" strokeWidth="3"></circle>
                    <circle 
                      className="text-primary transition-all duration-[1.5s] ease-out" 
                      cx="18" 
                      cy="18" 
                      fill="none" 
                      r="16" 
                      stroke="currentColor" 
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-lg font-bold">{readinessScore}%</span>
                    <span className="text-label-sm text-on-surface-variant">Match</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-body-md">Strong Skills</span>
                    </div>
                    <span className="font-bold">{strongCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-body-md">Average Skills</span>
                    </div>
                    <span className="font-bold">{avgCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-body-md">Weak Skills</span>
                    </div>
                    <span className="font-bold">{weakCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span className="text-body-md">Missing Skills</span>
                    </div>
                    <span className="font-bold">{missingCount}</span>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-body-md text-on-surface-variant italic">
                &ldquo;You&apos;re in good shape! Focus on weak and missing skills to get even better.&rdquo;
              </p>
            </div>

            {/* Skills Overview */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md">Skills Overview</h3>
                <Link className="text-primary font-bold text-label-md hover:underline" href="/gap-analysis">View all</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((skill) => {
                  const isActive = selectedSkills.includes(skill);
                  return (
                    <span 
                      key={skill}
                      onClick={() => handleChipClick(skill)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        isActive 
                          ? "bg-primary text-on-primary" 
                          : "bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
              <div className="mt-8">
                <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-4">What I&apos;m Working On</h4>
                <ul className="space-y-3">
                  {user.projects && user.projects.length > 0 ? (
                    user.projects.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex items-center gap-3 text-body-md">
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-green-500" : i === 1 ? "bg-blue-500" : "bg-purple-500"}`}></div>
                        {p.title}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-3 text-body-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Building AI powered SkillGap Analyzer
                      </li>
                      <li className="flex items-center gap-3 text-body-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Full Stack MERN Project
                      </li>
                      <li className="flex items-center gap-3 text-body-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        Preparing for DSA &amp; System Design
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

          </div>

          {/* Learning & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Learning Activity */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md">Recent Learning Activity</h3>
                <Link className="text-primary font-bold text-label-md hover:underline" href="/roadmap">View all</Link>
              </div>
              <div className="space-y-4">
                {user.learningProgress && user.learningProgress.length > 0 ? (
                  user.learningProgress.slice(0, 3).map((act, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container/50 border border-transparent hover:border-outline-variant transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined">code</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-body-md">{act.title}</h4>
                        <p className="text-label-sm text-on-surface-variant">Course • Dynamic Progress</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 font-bold">{Math.round(act.progress)}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container/50 border border-transparent hover:border-outline-variant transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined">code</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-body-md">React.js Fundamentals</h4>
                        <p className="text-label-sm text-on-surface-variant">Course • 2 days ago</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 font-bold">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container/50 border border-transparent hover:border-outline-variant transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">quiz</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-body-md">JavaScript Basics</h4>
                        <p className="text-label-sm text-on-surface-variant">Assessment • 4 days ago</p>
                      </div>
                      <div className="text-right">
                        <span className="text-primary font-bold">88%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container/50 border border-transparent hover:border-outline-variant transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">menu_book</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-body-md">System Design Basics</h4>
                        <p className="text-label-sm text-on-surface-variant">Course • 1 week ago</p>
                      </div>
                      <div className="text-right">
                        <span className="text-on-surface-variant font-medium bg-surface-container px-2 py-1 rounded text-xs">In Progress</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  AI Recommended
                </h3>
              </div>
              <div className="space-y-4">
                {user.skillGaps && user.skillGaps.length > 0 ? (
                  user.skillGaps.slice(0, 3).map((gap, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${
                      i === 0 
                        ? "bg-gradient-to-r from-secondary-container/5 to-transparent border-secondary-container/20" 
                        : "bg-surface-container/30 border-outline-variant/30"
                    }`}>
                      <div>
                        <h4 className="font-bold text-body-md">{gap.skill.name}</h4>
                        <p className="text-label-sm text-on-surface-variant truncate max-w-[200px] lg:max-w-[300px]">
                          {gap.whyItMatters || "High demand skill gap detected"}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${
                        gap.priority === "critical" || gap.priority === "high"
                          ? "bg-error-container text-error"
                          : gap.priority === "medium"
                            ? "bg-primary-fixed text-primary"
                            : "bg-surface-container text-on-surface-variant"
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-secondary-container/5 to-transparent border border-secondary-container/20">
                      <div>
                        <h4 className="font-bold text-body-md">Docker &amp; Containers</h4>
                        <p className="text-label-sm text-on-surface-variant">Vital for DevOps roles</p>
                      </div>
                      <span className="px-3 py-1 bg-error-container text-error rounded-full text-[11px] font-bold">High Priority</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/30">
                      <div>
                        <h4 className="font-bold text-body-md">AWS Cloud Architect</h4>
                        <p className="text-label-sm text-on-surface-variant">Cloud certification track</p>
                      </div>
                      <span className="px-3 py-1 bg-primary-fixed text-primary rounded-full text-[11px] font-bold">Recommended</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/30">
                      <div>
                        <h4 className="font-bold text-body-md">GraphQL API Design</h4>
                        <p className="text-label-sm text-on-surface-variant">Advanced backend skill</p>
                      </div>
                      <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[11px] font-bold">Medium</span>
                    </div>
                  </>
                )}
                <Link 
                  href="/roadmap"
                  className="w-full mt-2 py-3 bg-secondary text-on-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-center text-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                  View Learning Path
                </Link>
              </div>
            </div>

          </div>

          {/* Row: Badges, Career Goal, and AI Mentor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Badges Earned */}
            <div className="col-span-1 bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md">Badges Earned</h3>
                <button className="text-primary font-bold text-label-md hover:underline">View all</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-container/30">
                  <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary mb-2 shadow-inner">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  </div>
                  <span className="font-bold text-label-sm">Quick Learner</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-container/30">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-inner">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <span className="font-bold text-label-sm">Code Starter</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-container/30">
                  <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center text-secondary mb-2 shadow-inner">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                  <span className="font-bold text-label-sm">Consistent</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-container/30">
                  <div className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center text-tertiary mb-2 shadow-inner">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  </div>
                  <span className="font-bold text-label-sm">Top Performer</span>
                </div>
              </div>
            </div>

            {/* Career Goal */}
            <div className="col-span-1 bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
              <h3 className="font-headline-md text-headline-md mb-6">Career Goal</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center p-2">
                  <Image width={56} height={56} className="w-full h-full object-contain" alt="Microsoft" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlN2pB1kxtQ-9Urtne-M5p-Q1ocSBHfIIhrkRVNpYAKUW-sChupfwVaQTRYnsBHPHhiwgCcdw8GPxB8ODUnIAet9coPaPq_jKcUckNOAdd3wutZ7l8vOyvThWefxPBdSKXBCY9Qmy-Q3rds4qa3zA06ijS27GpIzfpAelh0TvL7x44kJUZhIR2aodG82k8As9yX-uVwgcanFxXb_SZKPsPCiq5elo6dAHDMEn3VX9yKUaAIX9JEvuxpw" />
                </div>
                <div>
                  <h4 className="font-bold text-body-lg">{user.profile?.dreamRole || "Software Engineer"}</h4>
                  <p className="text-on-surface-variant text-body-md">Microsoft • Dream Company</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-label-md font-bold">
                  <span>Readiness Score</span>
                  <span className="text-primary">{readinessScore}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${readinessScore}%` }}></div>
                </div>
              </div>
              <p className="mt-4 text-label-sm text-on-surface-variant">Focus on: Distributed Systems, System Design Patterns</p>
            </div>

            {/* AI Mentor Card */}
            <div className="col-span-1 bg-inverse-surface text-inverse-on-surface rounded-[24px] p-6 card-shadow relative overflow-hidden group">
              {/* ThreeJS Container */}
              <div className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
                <ThreeJSOrb threeLoaded={threeLoaded} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                <div>
                  <h3 className="font-headline-md text-headline-md mb-2">AI Mentor</h3>
                  <p className="text-body-md opacity-80 mb-8">Personalized guidance based on your progress.</p>
                </div>
                <div className="mt-auto">
                  <Link 
                    href="/dashboard"
                    className="w-full py-3 bg-white text-on-background rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors text-center text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    Ask Mentor
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* GitHub Overview Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 card-shadow">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface text-[24px]">terminal</span>
                <h3 className="font-headline-md text-headline-md">GitHub Overview</h3>
              </div>
              <a 
                className="text-primary font-bold text-label-md hover:underline" 
                href={user.githubProfile?.githubUsername ? `https://github.com/${user.githubProfile.githubUsername}` : "https://github.com/krishnatomar"}
                target="_blank"
                rel="noreferrer"
              >
                {user.githubProfile?.githubUsername ? `github.com/${user.githubProfile.githubUsername}` : "github.com/krishnatomar"}
              </a>
            </div>

            {user.githubProfile ? (
              <>
                <div className="bg-surface-container p-6 rounded-[16px] overflow-hidden">
                  <div className="grid grid-cols-12 md:grid-cols-24 gap-1 opacity-80 h-32">
                    {/* Simulated Contribution Grid boxes */}
                    {Array.from({ length: 168 }).map((_, i) => {
                      const intensities = ['bg-surface-variant', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'];
                      const pseudoIntensity = intensities[(i * 7 + 13) % intensities.length];
                      return (
                        <div key={i} className={`w-full h-full aspect-square rounded-sm ${pseudoIntensity}`}></div>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-surface-container/50 text-center">
                    <span className="text-headline-md font-bold block">{user.githubProfile.publicRepos}</span>
                    <span className="text-label-sm text-on-surface-variant">Repositories</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container/50 text-center">
                    <span className="text-headline-md font-bold block">1,240</span>
                    <span className="text-label-sm text-on-surface-variant">Commits</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container/50 text-center">
                    <span className="text-headline-md font-bold block">{githubStars}</span>
                    <span className="text-label-sm text-on-surface-variant">Stars</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 bg-surface-container p-6 rounded-[16px]">
                <p className="text-on-surface-variant mb-4">Connect your GitHub to sync repositories, commits, and star metrics.</p>
                <Link
                  href="/onboarding?step=4"
                  className="inline-flex items-center gap-2 bg-on-surface text-white px-6 py-2.5 rounded-xl font-label-md hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[20px]">link</span>
                  Connect GitHub Profile
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Profile Editing Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-md font-bold text-on-surface">Edit Profile Details</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-label-sm text-on-surface-variant font-bold">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-label-sm text-on-surface-variant font-bold">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-label-sm text-on-surface-variant font-bold">Dream Career Role</label>
                <input 
                  type="text" 
                  value={dreamRole}
                  onChange={(e) => setDreamRole(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-label-sm text-on-surface-variant font-bold">City</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bhopal"
                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-label-sm text-on-surface-variant font-bold">Country</label>
                  <input 
                    type="text" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-label-sm text-on-surface-variant font-bold">Experience Level</label>
                <select 
                  value={experienceLevel} 
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select Level</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/20">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline text-on-surface-variant text-sm font-medium hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-medium hover:opacity-90 flex items-center gap-2"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
