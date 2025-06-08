// 更准确的GPU性能检测
  let performanceLevel = detectGPUPerformance();
  
  function detectGPUPerformance() {
    // 创建临时canvas进行GPU性能测试
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 200;
    testCanvas.height = 200;
    const testCtx = testCanvas.getContext('2d');
    
    // 测试大量绘制操作的性能
    const start = performance.now();
    
    // 模拟复杂的Canvas绘制操作
    for (let i = 0; i < 1000; i++) {
      testCtx.beginPath();
      testCtx.arc(Math.random() * 200, Math.random() * 200, Math.random() * 10, 0, Math.PI * 2);
      testCtx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      testCtx.fill();
      
      // 绘制线条
      testCtx.beginPath();
      testCtx.moveTo(Math.random() * 200, Math.random() * 200);
      testCtx.lineTo(Math.random() * 200, Math.random() * 200);
      testCtx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      testCtx.stroke();
    }
    
    const elapsed = performance.now() - start;
    
    // 检查WebGL支持
    const webglSupported = (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })();
    
    // 检查硬件加速
    const hardwareAccelerated = (() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      return ctx.getContextAttributes ? ctx.getContextAttributes().antialias : true;
    })();
    
    // 综合判断
    if (webglSupported &&document.addEventListener('DOMContentLoaded', () => {
  // 创建交互式画布
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.7';
  document.body.appendChild(canvas);

  // 初始化画布
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // 鼠标位置
  let mouseX = width / 2;
  let mouseY = height / 2;
  let isActive = false;

  // 节流变量
  let lastMouseUpdate = 0;
  
  // 监听鼠标移动事件 - 自适应节流优化
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    // 根据性能调整节流时间
    if (now - lastMouseUpdate < currentConfig.mouseThrottle) return;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    isActive = true;
    lastMouseUpdate = now;
    
    // 添加鼠标点击时的扩散效果
    if (e.buttons === 1) {
      createPulseEffect(mouseX, mouseY);
    }
    
    // 1秒后自动关闭活跃状态
    setTimeout(() => {
      isActive = false;
    }, 1000);
  });
  
  // 点击事件
  document.addEventListener('click', (e) => {
    createPulseEffect(e.clientX, e.clientY);
  });

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  // 创建点击扩散效果
  function createPulseEffect(x, y) {
    pulses.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: 100,
      speed: 3,
      color: '#24c6dc',
      alpha: 1
    });
  }

  // 扩散效果数组
  const pulses = [];

  // 性能检测和自适应配置
  let performanceLevel = detectPerformance();
  
  function detectPerformance() {
    // 简单的性能检测
    const start = performance.now();
    for(let i = 0; i < 100000; i++) {
      Math.random() * Math.random();
    }
    const elapsed = performance.now() - start;
    
    if (elapsed < 20) return 'high';      // 高性能
    return 'low';                         // 低性能
  }
  
  // 根据性能调整参数
  const config = {
    high: { particles: 30, connections: 100, mouseThrottle: 33, effects: true, speedMultiplier: 0.33 },    // 30个粒子，保留特效，速度降到三分之一
    low: { particles: 0, connections: 0, mouseThrottle: 16, effects: false, speedMultiplier: 1 }           // 无粒子，鼠标正常
  };
  
  const currentConfig = config[performanceLevel];

  // 粒子配置 - 用户选择后动态设置
  const particles = [];
  const particleColor = '#24c6dc';
  const particleSecondaryColor = '#514a9d';
  const maxRadius = 5;
  
  // 创建粒子函数将在模式选择后调用

  // 动画函数
  function animate() {
    requestAnimationFrame(animate);
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 更新和绘制粒子 - 仅在有粒子时执行
    if (currentConfig.particles > 0) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // 闪烁效果 - 根据性能等级决定是否启用
        if (p.blink && currentConfig.effects) {
          p.alpha += Math.sin(Date.now() * p.blinkSpeed) * 0.05;
          p.alpha = Math.max(0.1, Math.min(0.8, p.alpha));
        }
        
        // 检查鼠标活跃状态 - 根据性能决定是否启用鼠标交互
        if (isActive && currentConfig.effects) {
          // 计算粒子与鼠标的距离 - 使用快速距离计算
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const distSq = dx * dx + dy * dy; // 使用距离的平方，避免开方运算
          
          // 鼠标排斥力 - 优化判断条件
          if (distSq < 10000) { // 100*100 = 10000，避免Math.sqrt
            const dist = Math.sqrt(distSq); // 只在需要时才开方
            const force = (100 - dist) / 15;
            p.vx += (dx / dist) * force * 0.15; // 减少力的强度
            p.vy += (dy / dist) * force * 0.15;
          }
        }
        
        // 限制速度
        p.vx = Math.min(3, Math.max(-3, p.vx));
        p.vy = Math.min(3, Math.max(-3, p.vy));
        
        // 更新位置 - 根据性能调整速度
        p.x += p.vx * currentConfig.speedMultiplier;
        p.y += p.vy * currentConfig.speedMultiplier;
        
        // 边界检查，从另一侧重新进入
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        
        // 绘制粒子间的连线 - 根据性能决定是否显示连线
        if (currentConfig.effects) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // 自适应连线距离
            if (dist < currentConfig.connections) {
              // 创建渐变连线
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = 0.2 * (1 - dist / currentConfig.connections);
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }
    }
    
    // 更新和绘制扩散效果 - 仅在高性能设备上显示
    if (currentConfig.effects) {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        
        pulse.radius += pulse.speed;
        pulse.alpha -= 0.02;
        
        if (pulse.alpha <= 0) {
          pulses.splice(i, 1);
          continue;
        }
        
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = pulse.color;
        ctx.globalAlpha = pulse.alpha;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 恢复原来的扩散连线生成概率
        if (Math.random() > 0.7) {
          const angle = Math.random() * Math.PI * 2;
          const distance = pulse.radius * 0.8;
          const endX = pulse.x + Math.cos(angle) * distance;
          const endY = pulse.y + Math.sin(angle) * distance;
          
          ctx.beginPath();
          ctx.moveTo(pulse.x, pulse.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = '#005080';
          ctx.globalAlpha = pulse.alpha * 0.7;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  
  // 启动动画
  animate();
});