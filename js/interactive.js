document.addEventListener('DOMContentLoaded', () => {
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
  let lastMouseUpdate = 0;

  // 基于浏览器类型判断性能 - 调试版本
  console.log('User Agent:', navigator.userAgent);
  console.log('Vendor:', navigator.vendor);
  
  // 多种检测方式
  const chromeTest1 = /Chrome/.test(navigator.userAgent);
  const chromeTest2 = /Google Inc/.test(navigator.vendor);
  const chromeTest3 = typeof window.chrome !== 'undefined';
  const edgeTest = /Edg/.test(navigator.userAgent);
  
  console.log('Chrome test 1 (/Chrome/):', chromeTest1);
  console.log('Chrome test 2 (/Google Inc/):', chromeTest2);
  console.log('Chrome test 3 (window.chrome):', chromeTest3);
  console.log('Edge test (/Edg/):', edgeTest);
  
  // 综合判断
  const isChrome = chromeTest1 && !edgeTest && (chromeTest2 || chromeTest3);
  
  console.log('Final Chrome detection:', isChrome);
  console.log('Performance mode:', isChrome ? 'HIGH' : 'LOW');
  
  // 根据浏览器调整参数
  const config = isChrome ? {
    particles: 10,
    connections: 100,
    mouseThrottle: 33,
    effects: true,
    speedMultiplier: 0.33  // Chrome: 速度三分之一
  } : {
    particles: 0,
    connections: 0,
    mouseThrottle: 16,
    effects: false,
    speedMultiplier: 0.33  // 其他浏览器也改成三分之一（虽然没有粒子）
  };

  // 监听鼠标移动事件
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMouseUpdate < config.mouseThrottle) return;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    isActive = true;
    lastMouseUpdate = now;
    
    if (e.buttons === 1) {
      createPulseEffect(mouseX, mouseY);
    }
    
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

  // 扩散效果数组
  const pulses = [];

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

  // 粒子配置
  const particles = [];
  const particleColor = '#24c6dc';
  const particleSecondaryColor = '#514a9d';
  const maxRadius = 5;
  
  // 创建粒子（仅Chrome）
  for (let i = 0; i < config.particles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * maxRadius + 1,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: Math.random() > 0.5 ? particleColor : particleSecondaryColor,
      alpha: Math.random() * 0.5 + 0.2,
      blink: Math.random() > 0.9,
      blinkSpeed: Math.random() * 0.05 + 0.01
    });
  }

  // 动画函数
  function animate() {
    requestAnimationFrame(animate);
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 更新和绘制粒子（仅Chrome）
    if (config.particles > 0) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // 闪烁效果
        if (p.blink && config.effects) {
          p.alpha += Math.sin(Date.now() * p.blinkSpeed) * 0.05;
          p.alpha = Math.max(0.1, Math.min(0.8, p.alpha));
        }
        
        // 鼠标交互
        if (isActive && config.effects) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 10000) {
            const dist = Math.sqrt(distSq);
            const force = (100 - dist) / 15;
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }
        }
        
        // 限制速度
        p.vx = Math.min(3, Math.max(-3, p.vx));
        p.vy = Math.min(3, Math.max(-3, p.vy));
        
        // 更新位置
        p.x += p.vx * config.speedMultiplier;
        p.y += p.vy * config.speedMultiplier;
        
        // 边界检查
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
        
        // 绘制连线
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < config.connections) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.2 * (1 - dist / config.connections);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
    
    // 更新和绘制扩散效果
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
      
      // 扩散连线
      if (Math.random() > (config.effects ? 0.7 : 0.9)) {
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
  
  // 启动动画
  animate();
});