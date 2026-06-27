/**
 * ISR International Shipping Routes - Main JavaScript
 * Professional Marine Cargo Website
 */

(function($) {
    'use strict';
    
    // Document Ready
    $(document).ready(function() {
        
        // Header Scroll Effect
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 100) {
                $('.header').addClass('scrolled');
            } else {
                $('.header').removeClass('scrolled');
            }
            
            // Scroll Top Button
            if ($(this).scrollTop() > 300) {
                $('#scrollTop').addClass('visible');
            } else {
                $('#scrollTop').removeClass('visible');
            }
        });
        
        // Mobile Menu Toggle
        $('#mobileToggle').on('click', function() {
            $(this).toggleClass('active');
            $('#navMenu').toggleClass('active');
        });
        
        // Close Mobile Menu on Link Click
        $('.nav-link').on('click', function() {
            $('#mobileToggle').removeClass('active');
            $('#navMenu').removeClass('active');
        });
        
        // Scroll Top Button Click
        $('#scrollTop').on('click', function() {
            $('html, body').animate({
                scrollTop: 0
            }, 800);
        });
        
        // FAQ Accordion
        $('.faq-question').on('click', function() {
            const parent = $(this).parent();
            const answer = parent.find('.faq-answer');
            
            // Close other open FAQs
            $('.faq-item').not(parent).removeClass('active');
            $('.faq-item').not(parent).find('.faq-answer').css('max-height', '0');
            
            // Toggle current FAQ
            parent.toggleClass('active');
            if (parent.hasClass('active')) {
                answer.css('max-height', answer.prop('scrollHeight') + 'px');
            } else {
                answer.css('max-height', '0');
            }
        });
        
        // Tracking Form Submit
        $('#trackForm').on('submit', function(e) {
            e.preventDefault();
            const trackingNumber = $('#trackingInput').val().trim();
            
            if (trackingNumber) {
                $('.spinner').show();
                $('#trackError').hide();
                
                // Simulate tracking API call
                setTimeout(function() {
                    $('.spinner').hide();
                    displayTrackingResult(trackingNumber);
                }, 1500);
            }
        });
        
        // Quote Form Submit
        $('#quoteForm').on('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: $('#quoteName').val(),
                email: $('#quoteEmail').val(),
                phone: $('#quotePhone').val(),
                origin: $('#quoteOrigin').val(),
                destination: $('#quoteDestination').val(),
                weight: $('#quoteWeight').val(),
                dimensions: $('#quoteDimensions').val(),
                service: $('#quoteService').val(),
                message: $('#quoteMessage').val()
            };
            
            $('.spinner').show();
            $('#quoteError').hide();
            $('#quoteSuccess').hide();
            
            // Send to PHP
            $.ajax({
                url: 'php/quote.php',
                type: 'POST',
                data: formData,
                success: function(response) {
                    $('.spinner').hide();
                    if (response.success) {
                        $('#quoteSuccess').fadeIn();
                        $('#quoteForm')[0].reset();
                    } else {
                        $('#quoteError').text(response.message).fadeIn();
                    }
                },
                error: function() {
                    $('.spinner').hide();
                    $('#quoteError').text('Something went wrong. Please try again.').fadeIn();
                }
            });
        });
        
        // Contact Form Submit
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: $('#contactName').val(),
                email: $('#contactEmail').val(),
                phone: $('#contactPhone').val(),
                subject: $('#contactSubject').val(),
                message: $('#contactMessage').val()
            };
            
            $('.spinner').show();
            $('#contactError').hide();
            $('#contactSuccess').hide();
            
            // Send to PHP
            $.ajax({
                url: 'php/contact.php',
                type: 'POST',
                data: formData,
                success: function(response) {
                    $('.spinner').hide();
                    if (response.success) {
                        $('#contactSuccess').fadeIn();
                        $('#contactForm')[0].reset();
                    } else {
                        $('#contactError').text(response.message).fadeIn();
                    }
                },
                error: function() {
                    $('.spinner').hide();
                    $('#contactError').text('Something went wrong. Please try again.').fadeIn();
                }
            });
        });
        
        // Newsletter Form Submit
        $('#newsletterForm').on('submit', function(e) {
            e.preventDefault();
            const email = $(this).find('input[type="email"]').val();
            
            $.ajax({
                url: 'php/newsletter.php',
                type: 'POST',
                data: { email: email },
                success: function(response) {
                    if (response.success) {
                        alert('Thank you for subscribing!');
                        $('#newsletterForm')[0].reset();
                    }
                }
            });
        });
        
        // Smooth Scroll for Anchor Links
        $('a[href^="#"]').on('click', function(e) {
            const target = $(this).attr('href');
            if (target !== '#' && $(target).length) {
                e.preventDefault();
                const offsetTop = $(target).offset().top - 80;
                $('html, body').animate({
                    scrollTop: offsetTop
                }, 800);
            }
        });
        
        // Animation on Scroll
        $(window).on('scroll', function() {
            $('.service-card, .blog-card, .testimonial-card').each(function() {
                const elementTop = $(this).offset().top;
                const elementVisible = 150;
                const windowBottom = $(window).scrollTop() + $(window).height();
                
                if (elementTop < windowBottom - elementVisible) {
                    $(this).addClass('fade-in');
                }
            });
        });
        
        // Click-to-call for phone numbers
        $('a[href^="tel:"]').on('click', function() {
            // Track phone call click (analytics)
            console.log('Phone call initiated');
        });
        
        // Initialize Tooltips
        $('[data-bs-toggle="tooltip"]').tooltip();
    });
    
    // Display Tracking Result (Mock Data)
    function displayTrackingResult(trackingNumber) {
        const mockData = {
            'status': 'In Transit',
            'origin': 'Sharjah, UAE',
            'destination': 'Karachi, Pakistan',
            'estimatedDelivery': 'February 25, 2026',
            'events': [
                {
                    'status': 'Shipment in transit',
                    'location': 'Dubai Port',
                    'date': 'February 22, 2026 - 10:30 AM',
                    'active': true
                },
                {
                    'status': 'Customs clearance completed',
                    'location': 'Dubai Customs',
                    'date': 'February 21, 2026 - 4:15 PM',
                    'active': false
                },
                {
                    'status': 'Shipment picked up',
                    'location': 'Sharjah Warehouse',
                    'date': 'February 20, 2026 - 9:00 AM',
                    'active': false
                },
                {
                    'status': 'Shipment received at warehouse',
                    'location': 'Sharjah Warehouse',
                    'date': 'February 19, 2026 - 2:00 PM',
                    'active': false
                }
            ]
        };
        
        const timelineHTML = mockData.events.map(function(event, index) {
            return `
                <div class="timeline-item">
                    <div class="timeline-dot ${event.active ? 'active' : ''}">
                        <i class="fas fa-${event.active ? 'circle' : 'check'}"></i>
                    </div>
                    <div class="timeline-content">
                        <h4>${event.status}</h4>
                        <p>${event.location} | ${event.date}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        $('#trackResult').html(`
            <div class="tracking-card">
                <div class="tracking-header">
                    <h3>Tracking: ${trackingNumber}</h3>
                    <p>Status: ${mockData.status}</p>
                </div>
                <div class="tracking-timeline">
                    ${timelineHTML}
                </div>
            </div>
        `).fadeIn();
    }
    
    // Language Switch Function (English only now)
    window.switchLanguage = function(lang) {
        // Only English is available now
        $('html').attr('lang', 'en').attr('dir', 'ltr');
        localStorage.setItem('mamo_lang', 'en');
    };
    
    // Load saved language preference (English only now)
    $(document).ready(function() {
        localStorage.setItem('mamo_lang', 'en');
    });
    
    // Preload images
    $(window).on('load', function() {
        $('body').addClass('loaded');
    });
    
    // ============================================
    // Live Chat Widget
    // ============================================
    
    // Chat Widget Toggle
    $('#chatToggle').on('click', function() {
        $('#chatWidget').toggleClass('active');
        $(this).hide();
    });
    
    $('#closeChat').on('click', function() {
        $('#chatWidget').removeClass('active');
        $('#chatToggle').show();
    });
    
    // Chat Message Send
    $('#sendChat').on('click', function() {
        const message = $('#chatInput').val().trim();
        if (message) {
            addChatMessage(message, 'user');
            $('#chatInput').val('');
            
            // Simulate bot response
            setTimeout(function() {
                const responses = [
                    "Thank you for contacting ISR International Shipping Routes! How can I help you today?",
                    "Our team is available to assist you with shipping quotes.",
                    "You can track your shipment using our tracking page.",
                    "For immediate assistance, please WhatsApp us at +971589195672"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addChatMessage(randomResponse, 'bot');
            }, 1000);
        }
    });
    
    // Enter key to send
    $('#chatInput').on('keypress', function(e) {
        if (e.which === 13) {
            $('#sendChat').click();
        }
    });
    
    function addChatMessage(message, sender) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageHtml = `
            <div class="chat-message ${sender}">
                <div class="message-content">${message}</div>
                <span class="message-time">${time}</span>
            </div>
        `;
        $('#chatMessages').append(messageHtml);
        $('#chatMessages').scrollTop($('#chatMessages')[0].scrollHeight);
    }
    
    // Quick Chat Options
    $('.quick-chat-btn').on('click', function() {
        const message = $(this).data('message');
        $('#chatInput').val(message);
        $('#sendChat').click();
    });
    
    // WhatsApp Float Button
    $('#whatsappFloat').on('click', function() {
        window.open('https://wa.me/971589195672?text=Hello%20ISR%20Cargo,%20I%20need%20assistance%20with%20shipping', '_blank');
    });
    
    // ============================================
    // Shipping Calculator
    // ============================================
    
    $('#shippingCalculator').on('submit', function(e) {
        e.preventDefault();
        
        const origin = $('#calcOrigin').val();
        const destination = $('#calcDestination').val();
        const weight = parseFloat($('#calcWeight').val());
        const service = $('#calcService').val();
        
        if (!origin || !destination || !weight || weight <= 0) {
            $('#calcError').text('Please fill all fields correctly').fadeIn();
            return;
        }
        
        // Calculate base rates (mock pricing)
        const rates = {
            'standard': { base: 50, perKg: 2.5 },
            'express': { base: 100, perKg: 5 },
            'priority': { base: 200, perKg: 10 }
        };
        
        const rate = rates[service];
        const estimatedCost = rate.base + (weight * rate.perKg);
        const transitDays = service === 'standard' ? '7-10' : service === 'express' ? '3-5' : '1-2';
        
        $('#calcError').hide();
        $('#calcResult').html(`
            <div class="calc-result-box">
                <h4><i class="fas fa-calculator"></i> Estimated Quote</h4>
                <div class="calc-details">
                    <p><strong>Route:</strong> ${origin} → ${destination}</p>
                    <p><strong>Weight:</strong> ${weight} kg</p>
                    <p><strong>Service:</strong> ${service.charAt(0).toUpperCase() + service.slice(1)}</p>
                    <p><strong>Transit Time:</strong> ${transitDays} business days</p>
                </div>
                <div class="calc-price">
                    <span class="price-label">Estimated Cost:</span>
                    <span class="price-amount">AED ${estimatedCost.toFixed(2)}</span>
                </div>
                <p class="calc-note">*This is an estimate. Final cost may vary based on dimensions and additional services.</p>
                <a href="quote.html" class="btn btn-primary">Get Official Quote</a>
            </div>
        `).fadeIn();
    });
    
    // Customer Dashboard Login
    $('#dashboardLogin').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#dashEmail').val();
        const password = $('#dashPassword').val();
        
        $('.spinner').show();
        
        // Simulate login (replace with actual API call)
        setTimeout(function() {
            $('.spinner').hide();
            
            // Mock successful login
            localStorage.setItem('mamo_customer', JSON.stringify({
                email: email,
                name: 'Customer',
                loggedIn: true
            }));
            
            $('#dashboardLogin').hide();
            $('#dashboardPanel').fadeIn();
            loadDashboardData();
        }, 1500);
    });
    
    // Check if already logged in
    if (localStorage.getItem('mamo_customer')) {
        const customer = JSON.parse(localStorage.getItem('mamo_customer'));
        if (customer.loggedIn) {
            $('#dashboardLogin').hide();
            $('#dashboardPanel').fadeIn();
            loadDashboardData();
        }
    }
    
    // Logout
    $('#dashLogout').on('click', function() {
        localStorage.removeItem('mamo_customer');
        $('#dashboardPanel').hide();
        $('#dashboardLogin').fadeIn();
    });
    
    function loadDashboardData() {
        // Mock dashboard data
        $('#dashShipments').html(`
            <div class="dash-card">
                <h5><i class="fas fa-box"></i> Recent Shipments</h5>
                <div class="shipment-item">
                    <span class="shipment-id">#Mamo2026001</span>
                    <span class="shipment-status status-transit">In Transit</span>
                    <span class="shipment-date">Feb 20, 2026</span>
                </div>
                <div class="shipment-item">
                    <span class="shipment-id">#Mamo2025023</span>
                    <span class="shipment-status status-delivered">Delivered</span>
                    <span class="shipment-date">Jan 15, 2026</span>
                </div>
            </div>
        `);
        
        $('#dashAddresses').html(`
            <div class="dash-card">
                <h5><i class="fas fa-map-marker-alt"></i> Saved Addresses</h5>
                <div class="address-item">
                    <strong>Home</strong>
                    <p>123 ABC Road, Karachi, Pakistan</p>
                </div>
                <button class="btn btn-sm btn-outline-primary"><i class="fas fa-plus"></i> Add Address</button>
            </div>
        `);
        
        $('#dashProfile').html(`
            <div class="dash-card">
                <h5><i class="fas fa-user"></i> Profile</h5>
                <p><strong>Name:</strong> Customer Name</p>
                <p><strong>Email:</strong> ${JSON.parse(localStorage.getItem('mamo_customer')).email}</p>
                <p><strong>Member Since:</strong> January 2026</p>
                <button class="btn btn-sm btn-outline-primary">Edit Profile</button>
            </div>
        `);
    }
    
    // ============================================
    // Pickup Booking Form
    // ============================================
    
    $('#pickupForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            pickupType: $('#pickupType').val(),
            packageCount: $('#packageCount').val(),
            packageDesc: $('#packageDesc').val(),
            totalWeight: $('#totalWeight').val(),
            estValue: $('#estValue').val(),
            pickupName: $('#pickupName').val(),
            pickupPhone: $('#pickupPhone').val(),
            pickupEmail: $('#pickupEmail').val(),
            pickupAddress: $('#pickupAddress').val(),
            pickupCity: $('#pickupCity').val(),
            pickupArea: $('#pickupArea').val(),
            pickupDate: $('#pickupDate').val(),
            pickupTime: $('#pickupTime').val(),
            specialInstructions: $('#specialInstructions').val(),
            services: []
        };
        
        // Get selected services
        if ($('#packingService').is(':checked')) formData.services.push('Professional Packing');
        if ($('#insuranceService').is(':checked')) formData.services.push('Cargo Insurance');
        if ($('#fragileService').is(':checked')) formData.services.push('Fragile Handling');
        if ($('#smsService').is(':checked')) formData.services.push('SMS Notifications');
        
        // Update summary
        $('#summaryType').text(formData.pickupType);
        $('#summaryPackages').text(formData.packageCount + ' packages');
        $('#summaryWeight').text(formData.totalWeight + ' kg');
        $('#summaryDate').text(formData.pickupDate);
        $('#summaryTime').text(formData.pickupTime.replace('morning', '9 AM - 12 PM').replace('afternoon', '12 PM - 3 PM').replace('evening', '3 PM - 6 PM'));
        
        // Calculate services total
        let servicesTotal = 0;
        if ($('#packingService').is(':checked')) servicesTotal += 50;
        if ($('#insuranceService').is(':checked')) servicesTotal += (formData.estValue * 0.02);
        if ($('#fragileService').is(':checked')) servicesTotal += 25;
        if ($('#smsService').is(':checked')) servicesTotal += 5;
        
        $('#summaryServices').text('AED ' + servicesTotal.toFixed(2));
        
        $('#pickupError').hide();
        $('#pickupSuccess').hide();
        $('.spinner').show();
        
        // Simulate API call
        setTimeout(function() {
            $('.spinner').hide();
            
            // Generate reference number
            const refNumber = 'ISR-P' + Date.now().toString().slice(-8);
            $('#pickupRef').text(refNumber);
            
            $('#pickupSuccess').fadeIn();
            $('#pickupForm')[0].reset();
            
            // Scroll to success message
            $('html, body').animate({
                scrollTop: $('#pickupSuccess').offset().top - 100
            }, 800);
        }, 2000);
    });
    
    // ============================================
    // Insurance Calculator
    // ============================================
    
    $('#insuranceForm').on('submit', function(e) {
        e.preventDefault();
        
        const cargoValue = parseFloat($('#insValue').val());
        const cargoType = $('#insType').val();
        
        if (!cargoValue || cargoValue <= 0) {
            $('#insError').text('Please enter a valid cargo value').fadeIn();
            return;
        }
        
        // Insurance rates based on type
        const rates = {
            'general': 0.015,
            'electronics': 0.025,
            'fragile': 0.035,
            'valuable': 0.05
        };
        
        const rate = rates[cargoType] || 0.02;
        const premium = cargoValue * rate;
        const coverage = cargoValue;
        
        $('#insError').hide();
        $('#insResult').html(`
            <div class="insurance-result">
                <h4><i class="fas fa-shield-alt"></i> Insurance Quote</h4>
                <div class="ins-details">
                    <div class="ins-item">
                        <span>Cargo Type:</span>
                        <span>${cargoType.charAt(0).toUpperCase() + cargoType.slice(1)}</span>
                    </div>
                    <div class="ins-item">
                        <span>Declared Value:</span>
                        <span>AED ${cargoValue.toLocaleString()}</span>
                    </div>
                    <div class="ins-item">
                        <span>Coverage:</span>
                        <span>AED ${coverage.toLocaleString()}</span>
                    </div>
                </div>
                <div class="ins-premium">
                    <span>Premium (${(rate * 100).toFixed(1)}%):</span>
                    <strong>AED ${premium.toFixed(2)}</strong>
                </div>
                <p class="ins-note">* This is a quote. Final premium may vary based on assessment.</p>
                <a href="quote.html" class="btn btn-primary">Get Full Quote</a>
            </div>
        `).fadeIn();
    });
    
})(jQuery);
