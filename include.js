// js/include.js
class HTMLInclude {
  static async loadComponent(elementId, filePath) {
      const container = document.getElementById(elementId);
      
      if (!container) {
          console.error(`找不到元素: ${elementId}`);
          return;
      }
      
      try {
          const response = await fetch(filePath);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const html = await response.text();
          container.innerHTML = html;
          
          // 載入完成後初始化 Bootstrap 和其他功能
          this.initializeComponents();
          
      } catch (error) {
          console.error('載入組件失敗:', error);
          container.innerHTML = `
              <div class="alert alert-warning" role="alert">
                  <i class="fas fa-exclamation-triangle"></i> 
                  載入導航列失敗，請重新整理頁面
              </div>
          `;
      }
  }
  
  static initializeComponents() {
      // 重新初始化 Bootstrap 下拉選單
      if (typeof bootstrap !== 'undefined') {
          const dropdowns = document.querySelectorAll('.dropdown-toggle');
          dropdowns.forEach(dropdown => {
              new bootstrap.Dropdown(dropdown);
          });
      }
      
      // 初始化多層下拉選單
      this.initializeSubmenu();
      
      // 重新綁定滾動事件（如果需要）
      this.initializeScrollEvents();
  }
  
  static initializeSubmenu() {
      // 手機版本的多層下拉選單處理
      $('.dropdown-submenu').off('click').on('click', function(e) {
          if ($(window).width() <= 991) {
              e.preventDefault();
              e.stopPropagation();
              
              const $submenu = $(this).find('.dropdown-menu').first();
              
              if ($submenu.is(':visible')) {
                  $submenu.slideUp(200);
              } else {
                  // 先關閉其他子選單
                  $('.dropdown-submenu .dropdown-menu').slideUp(200);
                  $submenu.slideDown(200);
              }
          }
      });
      
      // 點擊子選單項目時不關閉選單
      $('.dropdown-submenu .dropdown-menu .dropdown-item').off('click').on('click', function(e) {
          e.stopPropagation();
      });
  }
  
  static initializeScrollEvents() {
      // 重新綁定您原有的滾動事件
      $(window).off("scroll.navbar").on("scroll.navbar", function () {
          var bodyScroll = $(window).scrollTop(),
              navbar = $(".navbar");
          
          if(bodyScroll > 50){
              $('.navbar-logo img').attr('src','images/logo.jpg');
              navbar.addClass("nav-scroll");
          } else {
              $('.navbar-logo img').attr('src','images/logo.jpg');
              navbar.removeClass("nav-scroll");
          }
      });
  }
}

// 頁面載入完成後自動載入組件
document.addEventListener('DOMContentLoaded', function() {
  HTMLInclude.loadComponent('navbar-container', 'navbar.html');
});