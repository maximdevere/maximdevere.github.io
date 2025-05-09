document.addEventListener('DOMContentLoaded', () => {
  const parallaxElements = [];
  
  // 创建视差元素
  function createParallaxElements() {
    // 清除旧元素
    parallaxElements.forEach(el => el.remove());
    parallaxElements.length = 0;
    
    // 创建半透明形状，添加到背景
    for (let i = 0; i < 10; i++) {
      const shape = document.createElement('div');
      const size = Math.random() * 150 + 50;
      const isCircle = Math.random() > 0.5;
      
      // 设置基本样式
      shape.style.position = 'fixed';
      shape.style.zIndex = '-1';
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.opacity = Math.random() * 0.2 + 0.05;
      shape.style.pointerEvents = 'none';
      
      // 随机位置
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      
      // 随机形状和颜色
      if (isCircle) {
        shape.style.borderRadius = '50%';
      } else {
        shape.style.borderRadius = `${Math.random() * 30}%`;
        shape.style.transform = `rotate(${Math.random() * 360}deg)`;
      }
      
      // 随机使用主题颜色
      const useMainColor = Math.random() > 0.5;
      const color = useMainColor ? '#24c6dc' : '#514a9d';
      shape.style.backgroundColor = color;
      
      // 为每个形状分配不同的滚动速度
      shape.dataset.speed = (Math.random() * 2 - 1) * 0.1;
      shape.dataset.offset = Math.random() * 100;
      
      // 添加到页面
      document.body.appendChild(shape);
      parallaxElements.push(shape);
    }
  }
  
  // 处理滚动事件
  function handleScroll() {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.speed);
      const offset = parseFloat(el.dataset.offset);
      
      // 应用视差移动
      el.style.transform = `translateY(${scrollY * speed + offset}px) rotate(${scrollY * speed * 10}deg)`;
    });
  }
  
  // 响应窗口大小变化
  function handleResize() {
    createParallaxElements();
    handleScroll();
  }
  
  // 添加事件监听
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  
  // 初始化
  createParallaxElements();
  
  // 滚动到链接位置时的平滑效果
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // 平滑滚动到目标位置
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 创建视差章节滚动效果
  document.querySelectorAll('section, article, .home-article-item').forEach(section => {
    // 设置初始透明度和变换
    section.style.opacity = '0.5';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    // 创建观察器来检测元素是否可见
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        } else {
          entry.target.style.opacity = '0.5';
          entry.target.style.transform = 'translateY(50px)';
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(section);
  });
}); 