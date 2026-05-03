/**
 * @file main.js
 * @description Archivo JavaScript global principal de la aplicación web.
 * Actúa como el controlador central, encargándose de inicializar componentes 
 * comunes en todas las pantallas y de delegar la lógica específica según la página.
 */

const App = {
  /**
   * @section Inicialización Principal
   * Método principal de arranque. Se ejecuta cuando el DOM está completamente cargado.
   */
  init() {
    this.initGlobalComponents();
    this.initPageSpecificFeatures();
  },

  /**
   * @section Componentes Globales
   * @component Iconos (Lucide) y Dropdowns
   * Inicializa componentes y utilidades que se comparten en todas las pantallas.
   */
  initGlobalComponents() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    } else {
      console.warn('Advertencia: Lucide icons no está cargado en esta página.');
    }

    this.initDropdowns();
    this.initSidebar();
    this.initCharts();
    this.initModals();
    this.initMultiSelects();
    this.initToasts();
    this.initBadgeToggles();
    this.initAccordionGroup();
    this.initMisSolicitudesToggle();
    this.initSearchDropdowns();
  },

  /**
   * @section UI Genérica
   * @component Sidebar
   * Lógica para el menú lateral en dispositivos móviles.
   */
  initSidebar() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!mobileMenuBtn || !sidebar) return;

    const toggleSidebar = () => {
      const isClosed = sidebar.classList.contains('-left-full');
      
      if (isClosed) {
        // Abrir
        sidebar.classList.remove('-left-full');
        sidebar.classList.add('left-0');
        if (overlay) {
          overlay.classList.remove('hidden');
          // Pequeño timeout para permitir que se aplique la transición de opacidad
          setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        }
      } else {
        // Cerrar
        sidebar.classList.remove('left-0');
        sidebar.classList.add('-left-full');
        if (overlay) {
          overlay.classList.add('opacity-0');
          setTimeout(() => overlay.classList.add('hidden'), 300);
        }
      }
    };

    mobileMenuBtn.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
  },

  /**
   * @section Gráficos Estadísticos
   * @component Chart.js
   * Configuración e inicialización de todos los gráficos del Dashboard.
   */
  initCharts() {
    // Verificar que Chart.js esté cargado
    if (typeof Chart === 'undefined') return;

    // Configuración global de Chart.js
    Chart.defaults.font.family = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.color = '#6C757D'; // text-tertiary
    
    // Opciones comunes para gráficos de Dona/Pastel
    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '0%', 
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(33, 37, 41, 0.9)',
          padding: 12,
          cornerRadius: 8,
          bodyFont: { size: 13 },
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.chart._metasets[context.datasetIndex].total;
              const percentage = Math.round((value / total) * 100);
              return ` ${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };

    // Opciones comunes para gráficos de Barras
    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(33, 37, 41, 0.9)',
          padding: 12,
          cornerRadius: 8,
          bodyFont: { size: 13 }
        }
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { font: { size: 11 }, color: '#6B7280' }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#E5E7EB',
            borderDash: [5, 5],
            drawBorder: false
          },
          ticks: {
            font: { size: 12 },
            color: '#6B7280',
            padding: 10
          }
        }
      }
    };

    // 1. Distribución por Prioridad (Pie)
    const ctxPriority = document.getElementById('chartPriority');
    if (ctxPriority) {
      new Chart(ctxPriority, {
        type: 'pie',
        data: {
          labels: ['Prioridad 1', 'Prioridad 2', 'Prioridad Sin definir'],
          datasets: [{
            data: [31, 10, 5],
            backgroundColor: ['#00AEB8', '#6DD3DA', '#A8E6E8'],
            borderWidth: 2,
            borderColor: '#FFFFFF'
          }]
        },
        options: pieOptions
      });
    }

    // 2. Distribución por Tipo de Ejecución (Bar)
    const ctxExecution = document.getElementById('chartExecution');
    if (ctxExecution) {
      new Chart(ctxExecution, {
        type: 'bar',
        data: {
          labels: ['Renovación', 'Gestión beneficio', 'Sin definir'],
          datasets: [{
            data: [30, 11, 5], 
            backgroundColor: '#00AEB8',
            borderRadius: { topLeft: 8, topRight: 8 },
            barPercentage: 0.5,
            categoryPercentage: 0.8
          }]
        },
        options: {
          ...barOptions,
          scales: {
            ...barOptions.scales,
            y: {
              ...barOptions.scales.y,
              max: 32,
              ticks: { ...barOptions.scales.y.ticks, stepSize: 8 }
            }
          }
        }
      });
    }

    // 3. Estado de Aprobación (Pie)
    const ctxApproval = document.getElementById('chartApproval');
    if (ctxApproval) {
      new Chart(ctxApproval, {
        type: 'pie',
        data: {
          labels: ['Aprobado', 'Sin definir'],
          datasets: [{
            data: [41, 5],
            backgroundColor: ['#00AEB8', '#FF6B6B'],
            borderWidth: 2,
            borderColor: '#FFFFFF'
          }]
        },
        options: pieOptions
      });
    }

    // 4. Distribución por Porcentaje (Bar)
    const ctxPercentage = document.getElementById('chartPercentage');
    if (ctxPercentage) {
      new Chart(ctxPercentage, {
        type: 'bar',
        data: {
          labels: ['100%', '80%', '70%', 'Gratis', 'Sin definir'],
          datasets: [{
            data: [32, 2, 6, 1, 5], 
            backgroundColor: '#00AEB8',
            borderRadius: { topLeft: 8, topRight: 8 },
            barPercentage: 0.6
          }]
        },
        options: {
          ...barOptions,
          scales: {
            ...barOptions.scales,
            y: {
              ...barOptions.scales.y,
              max: 32,
              ticks: { ...barOptions.scales.y.ticks, stepSize: 8 }
            }
          }
        }
      });
    }

    // 5. Proporción de Establecimientos por Categoría (Bar)
    const ctxCategory = document.getElementById('chartCategory');
    if (ctxCategory) {
      new Chart(ctxCategory, {
        type: 'bar',
        data: {
          labels: ['Restaurante', 'Entretenimiento', 'Gastronomía', 'Tecnología', 'Salud'],
          datasets: [{
            label: 'Cantidad de Establecimientos',
            data: [41, 2, 2, 1, 1], 
            backgroundColor: '#00AEB8',
            borderRadius: { topLeft: 8, topRight: 8 },
            barPercentage: 0.4
          }]
        },
        options: {
          ...barOptions,
          plugins: {
            ...barOptions.plugins,
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                boxWidth: 8,
                boxHeight: 8
              }
            }
          },
          scales: {
            ...barOptions.scales,
            y: {
              ...barOptions.scales.y,
              max: 40,
              ticks: { ...barOptions.scales.y.ticks, stepSize: 10 }
            }
          }
        }
      });
    }
  },

  /**
   * @section UI Genérica
   * @component Dropdowns
   * Lógica reutilizable para cualquier menú desplegable usando data-attributes.
   * Atributos necesarios: data-dropdown, data-dropdown-toggle="id", data-dropdown-menu="id"
   */
  initDropdowns() {
    const toggles = document.querySelectorAll('[data-dropdown-toggle]');

    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar cierre inmediato

        const dropdownId = toggle.getAttribute('data-dropdown-toggle');
        const menu = document.querySelector(`[data-dropdown-menu="${dropdownId}"]`);

        if (!menu) return;

        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Cerrar otros dropdowns si hay múltiples
        if (!isExpanded) {
          this.closeAllDropdowns();
        }

        toggle.setAttribute('aria-expanded', !isExpanded);

        if (!isExpanded) {
          // Abrir
          menu.classList.remove('opacity-0', 'invisible', 'translate-y-[-10px]');
          menu.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
          // Cerrar
          menu.classList.add('opacity-0', 'invisible', 'translate-y-[-10px]');
          menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
      });
    });

    // Cerrar dropdowns al hacer clic en cualquier parte fuera de ellos
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        this.closeAllDropdowns();
      }
    });
  },

  /**
   * Cierra todos los dropdowns activos de la interfaz.
   */
  closeAllDropdowns() {
    const menus = document.querySelectorAll('[data-dropdown-menu]');
    const toggles = document.querySelectorAll('[data-dropdown-toggle]');

    toggles.forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));

    menus.forEach(menu => {
      menu.classList.add('opacity-0', 'invisible', 'translate-y-[-10px]');
      menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
    });
  },

  /**
   * @section UI Genérica
   * @component Modales
   * Sistema de modales gestionado por atributos de datos.
   */
  initModals() {
    const openBtns = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('[data-modal-hide]');

    // Función para abrir
    const openModal = (modalId) => {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      const modalContent = modal.querySelector('div');

      // Mostrar contenedor
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Animar entrada (pequeño delay para que aplique la transición tras quitar 'hidden')
      requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        if (modalContent) {
          if (modalContent.classList.contains('translate-x-full')) {
            modalContent.classList.remove('translate-x-full');
            modalContent.classList.add('translate-x-0');
          } else if (modalContent.classList.contains('scale-95')) {
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
          }
          
          // Refresh Lucide icons inside the modal
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      });
    };

    // Función para cerrar
    const closeModal = (modal) => {
      if (!modal) return;
      const modalContent = modal.querySelector('div');

      // Animar salida
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0');
      if (modalContent) {
        if (modalContent.classList.contains('translate-x-0')) {
          modalContent.classList.remove('translate-x-0');
          modalContent.classList.add('translate-x-full');
        } else if (modalContent.classList.contains('scale-100')) {
          modalContent.classList.remove('scale-100');
          modalContent.classList.add('scale-95');
        }
      }

      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Ocultar despues de la transicion (300ms)
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    };

    // Configurar botones de apertura
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-modal-target');
        openModal(targetId);
      });
    });

    // Configurar botones de cierre
    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-modal-hide');
        const modal = document.getElementById(targetId) || btn.closest('.fixed.inset-0');
        closeModal(modal);
      });
    });

    // Cerrar al hacer clic en el backdrop
    const allModals = document.querySelectorAll('.fixed.inset-0');
    allModals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        // Asegurarse de que se clicó el backdrop y no el contenido del modal
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const visibleModals = document.querySelectorAll('.fixed.inset-0:not(.hidden)');
        visibleModals.forEach(modal => closeModal(modal));
      }
    });
  },

  /**
   * @section UI Genérica
   * @component MultiSelect Dropdowns
   * Lógica para selects múltiples con checkboxes y pills.
   */
  /**
   * @section UI Genérica
   * @component Toast Notifications
   */
  initToasts() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-[24px] right-[24px] z-[10000] flex flex-col gap-[12px] pointer-events-none';
      document.body.appendChild(container);
    }
  },

  showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    let bgClass, borderClass, textClass, iconBgClass, iconName;
    if (type === 'success') {
      bgClass = 'bg-[#ECFDF5]';
      borderClass = 'border-[#A7F3D0]';
      textClass = 'text-[#065F46]';
      iconBgClass = 'bg-[#059669]';
      iconName = 'check';
    } else if (type === 'info') {
      bgClass = 'bg-[#EFF6FF]';
      borderClass = 'border-[#BFDBFE]';
      textClass = 'text-[#1E40AF]';
      iconBgClass = 'bg-[#3B82F6]';
      iconName = 'info';
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto relative flex items-start gap-[12px] p-[16px] ${bgClass} border ${borderClass} rounded-[8px] shadow-lg transform transition-all duration-300 translate-x-[120%] max-w-[350px] w-[350px] opacity-0`;

    toast.innerHTML = `
      <button class="absolute -top-[10px] -left-[10px] w-[24px] h-[24px] ${bgClass} border ${borderClass} rounded-full flex items-center justify-center ${textClass} hover:opacity-80 transition-opacity focus:outline-none" onclick="this.parentElement.style.opacity='0'; this.parentElement.style.transform='translateX(120%)'; setTimeout(() => this.parentElement.remove(), 300)">
        <i data-lucide="x" class="w-[12px] h-[12px]"></i>
      </button>
      <div class="mt-[2px] w-[20px] h-[20px] rounded-full ${iconBgClass} flex items-center justify-center flex-shrink-0 text-[#FFFFFF]">
        <i data-lucide="${iconName}" class="w-[12px] h-[12px]"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-[14px] font-semibold ${textClass} mb-[2px]">${title}</h4>
        ${message ? `<p class="text-[13px] ${textClass} m-0">${message}</p>` : ''}
      </div>
    `;

    container.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ root: toast });
    }

    // Animar entrada
    requestAnimationFrame(() => {
      // Forzar reflow
      toast.offsetHeight;
      toast.classList.remove('translate-x-[120%]', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    });

    // Animar salida después de 2s
    setTimeout(() => {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-[120%]', 'opacity-0');
      
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, 2000);
  },

  /**
   * @section UI Genérica
   * @component Toggle Badges
   * Maneja la expansión/contracción de insignias (badges) de cobertura.
   */
  initBadgeToggles() {
    const toggleBadgesBtns = document.querySelectorAll('.toggle-badges-btn');
    toggleBadgesBtns.forEach(badgeBtn => {
      // Evitar duplicados al reinicializar
      const newBtn = badgeBtn.cloneNode(true);
      badgeBtn.parentNode.replaceChild(newBtn, badgeBtn);

      newBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const container = this.parentElement;
        const hiddenBadges = container.querySelectorAll('.hidden-badge');
        const isExpanded = this.classList.contains('expanded');
        const count = this.getAttribute('data-count') || '';
        const textSpan = this.querySelector('.btn-text');
        const iconSvg = this.querySelector('svg') || this.querySelector('i');

        if (!isExpanded) {
          hiddenBadges.forEach(badge => {
            badge.classList.remove('hidden');
            badge.classList.add('inline-block');
          });
          if (textSpan) textSpan.textContent = "Menos";
          this.classList.add('expanded');
          if (iconSvg) iconSvg.style.transform = 'rotate(180deg)';
        } else {
          hiddenBadges.forEach(badge => {
            badge.classList.add('hidden');
            badge.classList.remove('inline-block');
          });
          
          const label = count ? `+${count} mas` : 'Ver más';
          if (textSpan) textSpan.textContent = label;
          this.classList.remove('expanded');
          if (iconSvg) iconSvg.style.transform = 'rotate(0deg)';
        }
      });
    });
  },

  /**
   * @section UI Genérica
   * @component Toggle Mis Solicitudes
   * Maneja el estado activo/inactivo del botón "Mis Solicitudes" y la visibilidad de la barra de resultados.
   */
  initMisSolicitudesToggle() {
    const btnMisSolicitudes = document.getElementById('btnMisSolicitudes');
    const iconStar = document.getElementById('iconMisSolicitudes');
    const badge = document.getElementById('badgeMisSolicitudes');
    const resultsBar = document.getElementById('resultsBar');

    if (!btnMisSolicitudes) return;

    btnMisSolicitudes.addEventListener('click', () => {
      const isCurrentlyActive = btnMisSolicitudes.getAttribute('data-active') === 'true';

      if (!isCurrentlyActive) {
        // Activar
        btnMisSolicitudes.setAttribute('data-active', 'true');
        btnMisSolicitudes.classList.remove('bg-[#FFFFFF]', 'border-[#DEE2E6]', 'text-[#495057]', 'font-medium');
        btnMisSolicitudes.classList.add('bg-[#FFFBEB]', 'border-[#F59E0B]', 'text-[#B45309]', 'font-bold', 'border-[2px]');
        
        if (iconStar) {
          iconStar.classList.remove('text-[#9CA3AF]');
          iconStar.classList.add('text-[#F59E0B]', 'fill-[#F59E0B]');
        }

        if (badge) {
          badge.classList.remove('bg-[#F1F3F5]', 'text-[#495057]');
          badge.classList.add('bg-[#F59E0B]', 'text-white');
        }

        if (resultsBar) {
          resultsBar.classList.remove('hidden');
        }
      } else {
        // Desactivar
        btnMisSolicitudes.setAttribute('data-active', 'false');
        btnMisSolicitudes.classList.add('bg-[#FFFFFF]', 'border-[#DEE2E6]', 'text-[#495057]', 'font-medium');
        btnMisSolicitudes.classList.remove('bg-[#FFFBEB]', 'border-[#F59E0B]', 'text-[#B45309]', 'font-bold', 'border-[2px]');

        if (iconStar) {
          iconStar.classList.add('text-[#9CA3AF]');
          iconStar.classList.remove('text-[#F59E0B]', 'fill-[#F59E0B]');
        }

        if (badge) {
          badge.classList.add('bg-[#F1F3F5]', 'text-[#495057]');
          badge.classList.remove('bg-[#F59E0B]', 'text-white');
        }

        if (resultsBar) {
          resultsBar.classList.add('hidden');
        }
      }
    });
  },

  initMultiSelects() {
    const multiSelects = document.querySelectorAll('.custom-multi-select');

    multiSelects.forEach(select => {
      const triggerBtn = select.querySelector('.select-trigger');
      const dropdown = select.querySelector('.options-dropdown');
      const checkboxes = select.querySelectorAll('input[type="checkbox"]');
      const selectedContainer = select.querySelector('.selected-container');
      const placeholderText = select.dataset.placeholder || 'Seleccionar...';
      const maxVisible = parseInt(select.dataset.maxVisible || '2', 10);

      // Alternar el dropdown al hacer clic
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const iconChevron = triggerBtn.querySelector('.lucide-chevron-down, [data-lucide="chevron-down"]');
        const isHidden = dropdown.classList.contains('hidden');
        
        // Cerrar otros multi-selects abiertos
        document.querySelectorAll('.custom-multi-select .options-dropdown').forEach(d => {
          if(d !== dropdown) {
            d.classList.add('hidden');
            const otherBtn = d.closest('.custom-multi-select').querySelector('.select-trigger').querySelector('.lucide-chevron-down, [data-lucide="chevron-down"]');
            if(otherBtn) otherBtn.classList.remove('rotate-180');
          }
        });

        if (isHidden) {
          dropdown.classList.remove('hidden');
          if (iconChevron) iconChevron.classList.add('rotate-180');
        } else {
          dropdown.classList.add('hidden');
          if (iconChevron) iconChevron.classList.remove('rotate-180');
        }
      });

      // Actualizar vista cuando cambia un checkbox
      const updateDisplay = () => {
        const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
        
        // Colorear los labels de las opciones y controlar el icono
        checkboxes.forEach(cb => {
          const label = cb.closest('label');
          const checkIcon = label.querySelector('svg, i');
          if (cb.checked) {
            label.classList.add('bg-[#E6F7F8]', 'text-[#00AEB8]');
            label.classList.remove('text-[#212529]', 'hover:bg-[#F8F9FA]');
            if (checkIcon) {
              checkIcon.classList.remove('opacity-0');
              checkIcon.classList.add('opacity-100');
            }
          } else {
            label.classList.remove('bg-[#E6F7F8]', 'text-[#00AEB8]');
            label.classList.add('text-[#212529]', 'hover:bg-[#F8F9FA]');
            if (checkIcon) {
              checkIcon.classList.remove('opacity-100');
              checkIcon.classList.add('opacity-0');
            }
          }
        });

        if (checkedBoxes.length === 0) {
          selectedContainer.innerHTML = `<span class="text-[#495057] truncate">${placeholderText}</span>`;
          return;
        }

        selectedContainer.innerHTML = ''; // Limpiar
        
        // Renderizar los pills
        const toShow = checkedBoxes.slice(0, maxVisible);
        toShow.forEach(cb => {
          const pill = document.createElement('span');
          pill.className = "inline-flex items-center gap-[4px] px-[8px] py-[2px] bg-[#E6F7F8] text-[#00AEB8] rounded-[4px] text-[12px] font-semibold";
          pill.innerHTML = `
            ${cb.value}
            <button type="button" class="remove-pill focus:outline-none hover:text-[#008f96] flex items-center justify-center p-[2px]" data-val="${cb.value}">
              <i data-lucide="x" class="w-[12px] h-[12px]"></i>
            </button>
          `;
          selectedContainer.appendChild(pill);
        });

        // Mostrar indicador de excedentes (+N)
        if (checkedBoxes.length > maxVisible) {
          const extraCount = checkedBoxes.length - maxVisible;
          const plusIndicator = document.createElement('span');
          plusIndicator.className = "inline-flex items-center justify-center px-[8px] py-[2px] bg-[#F8F9FA] text-[#495057] rounded-[4px] text-[12px] font-bold";
          plusIndicator.textContent = `+${extraCount}`;
          selectedContainer.appendChild(plusIndicator);
        }

        // Reconectar iconos de lucide si están presentes en la UI principal
        if (typeof lucide !== 'undefined') {
          lucide.createIcons({ nameAttr: 'data-lucide', root: selectedContainer });
        }

        // Añadir eventos a los botones de remover
        const removeBtns = selectedContainer.querySelectorAll('.remove-pill');
        removeBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar abrir/cerrar el dropdown
            const valToRemove = btn.getAttribute('data-val');
            const cbToUncheck = Array.from(checkboxes).find(c => c.value === valToRemove);
            if (cbToUncheck) {
              cbToUncheck.checked = false;
              updateDisplay();
            }
          });
        });
      };

      checkboxes.forEach(cb => {
        cb.addEventListener('change', updateDisplay);
      });

      // Evitar que hacer clic dentro del dropdown lo cierre
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Inicializar visualización
      updateDisplay();
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-multi-select')) {
        document.querySelectorAll('.custom-multi-select .options-dropdown').forEach(d => {
          d.classList.add('hidden');
          const btn = d.closest('.custom-multi-select').querySelector('.select-trigger').querySelector('.lucide-chevron-down, [data-lucide="chevron-down"]');
          if (btn) btn.classList.remove('rotate-180');
        });
      }
    });
  },

  /**
   * @section UI Genérica
   * @component Search Dropdowns
   * Lógica para mostrar y ocultar resultados de búsqueda en inputs específicos.
   */
  initSearchDropdowns() {
    // Delegación de eventos para mostrar/ocultar y selección
    document.addEventListener('click', (e) => {
      const searchInput = e.target.closest('.search-input');
      const optionBtn = e.target.closest('.search-result-item');
      const searchContainer = e.target.closest('.relative.group');
      const changeBtn = e.target.closest('.card-btn-change');

      // 1. Mostrar dropdown al hacer clic en el input
      if (searchInput) {
        const dropdown = searchContainer?.querySelector('.search-results');
        if (dropdown) dropdown.classList.remove('hidden');
      } 
      // 2. Manejar selección de opción
      else if (optionBtn) {
        const section = optionBtn.closest('.search-section');
        const searchUI = section.querySelector('.relative.group');
        const selectedUI = section.querySelector('.selected-establishment-card');
        
        // Extraer datos del item seleccionado
        const titleContainer = optionBtn.querySelector('.item-title');
        const title = titleContainer.childNodes[0].textContent.trim();
        const code = optionBtn.querySelector('.item-details span:nth-child(1)').textContent;
        const ruc = optionBtn.querySelector('.item-details span:nth-child(2)').textContent;
        const category = optionBtn.querySelector('.item-tag').textContent;
        
        // Poblar la card con la información seleccionada
        if (selectedUI) {
          selectedUI.querySelector('#selected-title').textContent = title;
          selectedUI.querySelector('#selected-code').textContent = code;
          selectedUI.querySelector('#selected-ruc').textContent = ruc.includes('RUC') ? ruc : `· RUC: ${ruc.replace('·', '').trim()}`;
          selectedUI.querySelector('#selected-category').textContent = category;
          
          // Cambiar de vista
          searchUI.classList.add('hidden');
          selectedUI.classList.remove('hidden');
          
          // Reinicializar iconos de Lucide si es necesario
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
      // 3. Manejar botón "Cambiar" para volver a la búsqueda
      else if (changeBtn) {
        const section = changeBtn.closest('.search-section');
        const searchUI = section.querySelector('.relative.group');
        const selectedUI = section.querySelector('.selected-establishment-card');
        
        selectedUI.classList.add('hidden');
        searchUI.classList.remove('hidden');
        searchUI.querySelector('.search-input').value = '';
        searchUI.querySelector('.search-input').focus();
      }
      // 4. Cerrar si se hace clic fuera del contenedor de búsqueda actual
      else {
        document.querySelectorAll('.search-results').forEach(d => {
          if (!searchContainer || d !== searchContainer.querySelector('.search-results')) {
            d.classList.add('hidden');
          }
        });
      }
    });

    // También abrir al enfocar por teclado para accesibilidad
    document.addEventListener('focusin', (e) => {
      if (e.target.classList.contains('search-input')) {
        const container = e.target.closest('.relative');
        const dropdown = container?.querySelector('.search-results');
        if (dropdown) dropdown.classList.remove('hidden');
      }
    });
  },


  /**
   * @section UI Genérica
   * @component Accordion Group
   * Lógica para grupos de acordeones que permiten múltiples aperturas simultáneas.
   */
  initAccordionGroup() {
    const toggles = document.querySelectorAll('.accordion-toggle');

    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-accordion-target');
        const content = document.getElementById(targetId);
        const icon = toggle.querySelector('i[data-lucide], svg');

        if (!content) return;

        const isHidden = content.classList.contains('hidden');

        if (isHidden) {
          // Abrir
          content.classList.remove('hidden');
          toggle.classList.add('bg-[#F8F9FA]');
          toggle.classList.remove('bg-white');
          if (icon) {
            icon.classList.add('rotate-90', 'text-[#00AEB8]');
            icon.classList.remove('text-[#6C757D]');
          }
        } else {
          // Cerrar
          content.classList.add('hidden');
          toggle.classList.remove('bg-[#F8F9FA]');
          toggle.classList.add('bg-white');
          if (icon) {
            icon.classList.remove('rotate-90', 'text-[#00AEB8]');
            icon.classList.add('text-[#6C757D]');
          }
        }
      });
    });
  },

  /**
   * @section Enrutador de Vistas
   * Detecta y ejecuta funcionalidades específicas dependiendo de la pantalla actual.
   */
  initPageSpecificFeatures() {
    // Pantalla: Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      this.setupLoginForm(loginForm);
    }

    // Pantalla: Admin Portafolio
    const btnImport = document.getElementById('btn-import-excel');
    const importSection = document.getElementById('import-excel-section');
    if (btnImport && importSection) {
      btnImport.addEventListener('click', () => {
        const isHidden = importSection.classList.contains('hidden');
        
        if (isHidden) {
          // Mostrar sección y activar botón
          importSection.classList.remove('hidden');
          btnImport.classList.remove('bg-white', 'text-[#00AEB8]');
          btnImport.classList.add('bg-[#00AEB8]', 'text-white');
        } else {
          // Ocultar sección y desactivar botón
          importSection.classList.add('hidden');
          btnImport.classList.add('bg-white', 'text-[#00AEB8]');
          btnImport.classList.remove('bg-[#00AEB8]', 'text-white');
        }
      });

      // Lógica de drag & drop opcional
      const dropZone = document.getElementById('drop-zone');
      const fileInput = document.getElementById('excel-file-input');
      if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
      }
    }

    // Pantalla: Admin Portafolio - Lógica del Modal Nuevo Establecimiento
    const btnSaveEstablecimiento = document.getElementById('btn-save-establecimiento');
    if (btnSaveEstablecimiento) {
      btnSaveEstablecimiento.addEventListener('click', () => {
        const modal = document.getElementById('modal-nuevo-establecimiento');
        if (modal) {
          // Cerrar el modal simulando clic en Cancelar (que tiene el data-modal-hide)
          const closeBtn = modal.querySelector('[data-modal-hide="modal-nuevo-establecimiento"]');
          if (closeBtn) closeBtn.click();
        }

        // Mostrar el toast de éxito
        this.showToast('Establecimiento guardado', 'El nuevo establecimiento ha sido registrado correctamente', 'success');
      });
    }

    // Pantalla: Admin Portafolio - Lógica del Modal Editar Establecimiento
    const btnUpdateEstablecimiento = document.getElementById('btn-update-establecimiento');
    if (btnUpdateEstablecimiento) {
      btnUpdateEstablecimiento.addEventListener('click', () => {
        const modal = document.getElementById('modal-editar-establecimiento');
        if (modal) {
          // Cerrar el modal simulando clic en Cancelar (que tiene el data-modal-hide)
          const closeBtn = modal.querySelector('[data-modal-hide="modal-editar-establecimiento"]');
          if (closeBtn) closeBtn.click();
        }

        // Mostrar el toast de éxito
        this.showToast('Cambios actualizados', 'La información del establecimiento ha sido actualizada correctamente', 'success');
      });
    }

    // Pantalla: Admin Portafolio - Lógica del Modal Eliminar Establecimiento
    const btnConfirmarEliminarEstablecimiento = document.getElementById('btn-confirmar-eliminar-establecimiento');
    if (btnConfirmarEliminarEstablecimiento) {
      btnConfirmarEliminarEstablecimiento.addEventListener('click', () => {
        const modal = document.getElementById('modal-eliminar-establecimiento');
        if (modal) {
          const closeBtn = modal.querySelector('[data-modal-hide="modal-eliminar-establecimiento"]');
          if (closeBtn) closeBtn.click();
        }

        // Mostrar el toast de éxito
        this.showToast('Establecimiento eliminado', 'El establecimiento ha sido removido del catálogo correctamente', 'info');
      });
    }
  },

  /**
   * @section Lógica de Pantalla: Login
   * @component Formulario de Inicio de Sesión
   * Configura los eventos y la lógica de validación para el inicio de sesión.
   * @param {HTMLFormElement} form - El formulario de inicio de sesión.
   */
  setupLoginForm(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      if (usernameInput && passwordInput) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username !== '' && password !== '') {
          // Redirigir a la pantalla principal
          window.location.href = 'inicio.html';
        }
      }
    });
  }
};

// Arrancar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
