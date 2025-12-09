$(document).ready(function() {
    // Form submission handler
    $('#registrationForm').on('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (this.checkValidity()) {
            // Show success modal
            showSuccessModal();
            
            // Clear form after a short delay
            setTimeout(function() {
                clearForm();
            }, 500);
        } else {
            // If form is invalid, trigger HTML5 validation
            this.reportValidity();
        }
    });

    // Clear button handler
    $('#clearBtn').on('click', function() {
        clearForm();
        // Add a subtle animation to indicate clearing
        $('.registration-form').css('animation', 'none');
        setTimeout(function() {
            $('.registration-form').css('animation', 'fadeInUp 0.5s ease');
        }, 10);
    });

    // Close modal handler
    $('#closeModal').on('click', function() {
        hideSuccessModal();
    });

    // Close modal when clicking outside
    $('#successModal').on('click', function(e) {
        if (e.target === this) {
            hideSuccessModal();
        }
    });

    // Close modal with Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#successModal').hasClass('show')) {
            hideSuccessModal();
        }
    });

    // Add interactive effects to form inputs
    $('.form-group input, .form-group select, .form-group textarea').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        $(this).parent().removeClass('focused');
    });

    // Add ripple effect to buttons
    $('.btn').on('click', function(e) {
        const button = $(this);
        const ripple = $('<span class="ripple"></span>');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.css({
            width: size,
            height: size,
            left: x,
            top: y
        });
        
        button.append(ripple);
        
        setTimeout(function() {
            ripple.remove();
        }, 600);
    });

    // Add smooth scroll to form on page load
    $('html, body').animate({
        scrollTop: $('.container').offset().top - 50
    }, 800);

    // Initialize calendar
    initCalendar();
});

// Calendar functionality
let currentDate = new Date();
let selectedDate = null;

function initCalendar() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Populate month dropdown
    const monthSelect = $('#calendarMonth');
    months.forEach((month, index) => {
        monthSelect.append(`<option value="${index}">${month}</option>`);
    });
    
    // Populate year dropdown (current year ± 5 years)
    const yearSelect = $('#calendarYear');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        yearSelect.append(`<option value="${i}">${i}</option>`);
    }
    
    // Set current month and year
    monthSelect.val(currentDate.getMonth());
    yearSelect.val(currentDate.getFullYear());
    
    // Render calendar
    renderCalendar();
    
    // Event handlers
    $('#calendarIcon, #startTerm').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCalendar();
    });
    
    $('#prevMonth').on('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        monthSelect.val(currentDate.getMonth());
        yearSelect.val(currentDate.getFullYear());
        renderCalendar();
    });
    
    $('#nextMonth').on('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        monthSelect.val(currentDate.getMonth());
        yearSelect.val(currentDate.getFullYear());
        renderCalendar();
    });
    
    $('#calendarMonth, #calendarYear').on('change', function() {
        currentDate.setMonth(parseInt($('#calendarMonth').val()));
        currentDate.setFullYear(parseInt($('#calendarYear').val()));
        renderCalendar();
    });
    
    // Close calendar when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.date-input-wrapper, .calendar-popup').length) {
            hideCalendar();
        }
    });
}

function toggleCalendar() {
    const calendar = $('#calendar');
    if (calendar.hasClass('show')) {
        hideCalendar();
    } else {
        showCalendar();
    }
}

function showCalendar() {
    $('#calendar').addClass('show');
    // Update calendar to show selected date if exists
    if (selectedDate) {
        currentDate = new Date(selectedDate);
        $('#calendarMonth').val(currentDate.getMonth());
        $('#calendarYear').val(currentDate.getFullYear());
        renderCalendar();
    }
}

function hideCalendar() {
    $('#calendar').removeClass('show');
}

function renderCalendar() {
    const calendarDays = $('#calendarDays');
    calendarDays.empty();
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = $(`<div class="calendar-day other-month">${day}</div>`);
        calendarDays.append(dayElement);
    }
    
    // Current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayElement = $(`<div class="calendar-day" data-date="${dayDate.toISOString()}">${day}</div>`);
        
        // Check if today
        if (dayDate.toDateString() === today.toDateString()) {
            dayElement.addClass('today');
        }
        
        // Check if selected
        if (selectedDate && dayDate.toDateString() === new Date(selectedDate).toDateString()) {
            dayElement.addClass('selected');
        }
        
        // Click handler
        dayElement.on('click', function() {
            const dateStr = $(this).data('date');
            selectDate(dateStr);
        });
        
        calendarDays.append(dayElement);
    }
    
    // Next month's days to fill the grid
    const totalCells = calendarDays.children().length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells && day <= 14; day++) {
        const dayElement = $(`<div class="calendar-day other-month">${day}</div>`);
        calendarDays.append(dayElement);
    }
}

function selectDate(dateStr) {
    selectedDate = dateStr;
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const formattedDate = `${months[date.getMonth()]}, ${date.getFullYear()}`;
    $('#startTerm').val(formattedDate);
    
    // Re-render to show selected state
    renderCalendar();
    
    // Hide calendar after a short delay
    setTimeout(function() {
        hideCalendar();
    }, 200);
}

// Function to show success modal
function showSuccessModal() {
    const modal = $('#successModal');
    modal.addClass('show');
    
    // Add entrance animation
    setTimeout(function() {
        modal.find('.modal-content').css('animation', 'modalSlideIn 0.4s ease');
    }, 10);
}

// Function to hide success modal
function hideSuccessModal() {
    const modal = $('#successModal');
    modal.removeClass('show');
}

// Function to clear form
function clearForm() {
    // Animate form clearing
    $('.form-group input, .form-group select, .form-group textarea').each(function(index) {
        const $this = $(this);
        setTimeout(function() {
            $this.val('').css({
                'opacity': '0.5',
                'transform': 'scale(0.98)'
            });
            setTimeout(function() {
                $this.css({
                    'opacity': '1',
                    'transform': 'scale(1)'
                });
            }, 200);
        }, index * 50);
    });
    
    // Reset form validation state
    $('#registrationForm')[0].reset();
    
    // Remove any validation classes
    $('.form-group input, .form-group select, .form-group textarea').removeClass('error valid');
    
    // Reset calendar
    selectedDate = null;
    currentDate = new Date();
    $('#calendarMonth').val(currentDate.getMonth());
    $('#calendarYear').val(currentDate.getFullYear());
    hideCalendar();
    renderCalendar();
}