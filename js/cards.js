document.addEventListener('DOMContentLoaded', () => {
  // 为文章卡片添加3D旋转效果
  const cards = document.querySelectorAll('.home-article-item');
  
  if (cards.length === 0) return;
  
  cards.forEach(card => {
    // 保存初始样式
    card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    
    card.addEventListener('mousemove', (e) => {
      // 获取卡片位置
      const rect = card.getBoundingClientRect();
      
      // 计算鼠标在卡片内的位置 (从-0.5到0.5)
      const xVal = (e.clientX - rect.left) / rect.width - 0.5;
      const yVal = (e.clientY - rect.top) / rect.height - 0.5;
      
      // 计算旋转角度 (最大15度)
      const rotateX = -yVal * 15;
      const rotateY = xVal * 15;
      
      // 应用3D变换
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      // 添加动态阴影
      const shadowX = xVal * 20;
      const shadowY = yVal * 20;
      card.style.boxShadow = `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.1)`;
    });
    
    // 鼠标离开时重置
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
    });
  });
  
  // 滚动动画效果
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.home-article-item, .sidebar-content, footer');
    
    elements.forEach(el => {
      // 检查元素是否在视口中
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (isInViewport) {
        // 如果元素还没有动画类，添加一个
        if (!el.classList.contains('animate-in')) {
          el.classList.add('animate-in');
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          
          // 延迟一点时间后添加过渡并显示元素
          setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 50);
        }
      }
    });
  };
  
  // 在页面加载和滚动时调用动画函数
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
  
  // 初始调用一次
  animateOnScroll();
}); 