document.addEventListener('DOMContentLoaded', () => {
  // 创建波浪效果类
  class TextWave {
    constructor(element, text) {
      this.element = element;
      this.originalText = text;
      this.chars = text.split('');
      this.tick = 0;
      this.isActive = false;
      this.initHTML();
    }
    
    initHTML() {
      // 清空原内容
      this.element.innerHTML = '';
      
      // 为每个字符创建span
      this.chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // 空格替换为非断空格
        span.style.display = 'inline-block';
        span.style.transition = 'transform 0.15s ease, color 0.3s ease';
        span.dataset.index = index;
        this.element.appendChild(span);
      });
      
      // 添加鼠标事件
      this.element.addEventListener('mouseenter', () => this.activate());
      this.element.addEventListener('mouseleave', () => this.deactivate());
    }
    
    activate() {
      this.isActive = true;
      this.animate();
    }
    
    deactivate() {
      this.isActive = false;
      
      // 重置所有字符
      Array.from(this.element.children).forEach(span => {
        span.style.transform = 'translateY(0)';
        span.style.color = '';
      });
    }
    
    animate() {
      if (!this.isActive) return;
      
      this.tick += 0.1;
      
      // 对每个字符应用波浪效果
      Array.from(this.element.children).forEach((span, index) => {
        const wave = Math.sin(this.tick + index * 0.2) * 8;
        span.style.transform = `translateY(${wave}px)`;
        
        // 添加渐变色效果
        const hue = (this.tick * 10 + index * 5) % 360;
        span.style.color = span.textContent !== '\u00A0' ? `hsl(${hue}, 80%, 50%)` : '';
      });
      
      requestAnimationFrame(() => this.animate());
    }
  }
  
  // 应用到标题元素
  const titles = document.querySelectorAll('.home-article-title, .site-title, h1, h2, h3');
  
  titles.forEach(title => {
    if (title.textContent.trim() !== '') {
      new TextWave(title, title.textContent);
    }
  });
  
  // 创建光标追踪效果
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.position = 'fixed';
  cursor.style.width = '12px';
  cursor.style.height = '12px';
  cursor.style.borderRadius = '50%';
  cursor.style.backgroundColor = 'rgba(36, 198, 220, 0.7)';
  cursor.style.pointerEvents = 'none';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.zIndex = '9999';
  cursor.style.transition = 'transform 0.1s ease-out, opacity 0.3s ease';
  cursor.style.boxShadow = '0 0 10px rgba(36, 198, 220, 0.5)';
  cursor.style.opacity = '0';
  document.body.appendChild(cursor);
  
  // 跟踪光标位置
  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // 交互元素悬停时放大光标
    const target = e.target;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || 
        target.classList.contains('home-article-item') || 
        target.closest('.home-article-item')) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.mixBlendMode = 'difference';
    } else {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.mixBlendMode = 'normal';
    }
  });
  
  // 鼠标离开窗口时隐藏光标
  document.addEventListener('mouseout', () => {
    cursor.style.opacity = '0';
  });
}); 