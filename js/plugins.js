
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
      arguments.callee = arguments.callee.caller;
      console.log( Array.prototype.slice.call(arguments) );
  }
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// place any jQuery/helper plugins in here, instead of separate, slower script files.
















































/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 *
 * Requires: 1.2.2+
 */
(function(c){var a=["DOMMouseScroll","mousewheel"];c.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var d=a.length;d;){this.addEventListener(a[--d],b,false)}}else{this.onmousewheel=b}},teardown:function(){if(this.removeEventListener){for(var d=a.length;d;){this.removeEventListener(a[--d],b,false)}}else{this.onmousewheel=null}}};c.fn.extend({mousewheel:function(d){return d?this.bind("mousewheel",d):this.trigger("mousewheel")},unmousewheel:function(d){return this.unbind("mousewheel",d)}});function b(i){var g=i||window.event,f=[].slice.call(arguments,1),j=0,h=true,e=0,d=0;i=c.event.fix(g);i.type="mousewheel";if(i.wheelDelta){j=i.wheelDelta/120}if(i.detail){j=-i.detail/3}d=j;if(g.axis!==undefined&&g.axis===g.HORIZONTAL_AXIS){d=0;e=-1*j}if(g.wheelDeltaY!==undefined){d=g.wheelDeltaY/120}if(g.wheelDeltaX!==undefined){e=-1*g.wheelDeltaX/120}f.unshift(i,j,e,d);return c.event.handle.apply(this,f)}})(jQuery);
















































/**
 * SlideDeck 1.1.7 Lite - 2010-07-18
 * Copyright (c) 2010 digital-telepathy (http://www.dtelepathy.com)
 * 
 * Support the developers by purchasing the Pro version at http://www.slidedeck.com/download
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * 
 * More information on this project:
 * http://www.slidedeck.com/
 * 
 * Requires: jQuery v1.3+
 * 
 * Full Usage Documentation: http://www.slidedeck.com/usage-documentation 
 * Usage:
 *     $(el).slidedeck(opts);
 * 
 * @param {HTMLObject} el	The <DL> element to extend as a SlideDeck
 * @param {Object} opts		An object to pass custom override options to
 */

var SlideDeck;

(function($){
	SlideDeck = function(el,opts){
		var self = this,
			el = $(el);
		
        var VERSION = "1.1.6";
        
		this.options = {
			speed: 500,
			transition: 'swing',
			start: 1,
			activeCorner: true,
			index: true,
			scroll: true,
			keys: true,
			autoPlay: false,
			autoPlayInterval: 5000,
			hideSpines: false,
			cycle: false
		};
		
		this.classes = {
			slide: 'slide',
			spine: 'spine',
			label: 'label',
			index: 'index',
			active: 'active',
			indicator: 'indicator',
			activeCorner: 'activeCorner',
			disabled: 'disabled',
            vertical: 'slidesVertical',
            previous: 'previous',
            next: 'next'
		};
		
		this.current = 1;
		this.deck = el;
		this.spines = el.find('dt');
		this.slides = el.find('dd');
		this.controlTo = 1;
		this.session = [];
		this.disabledSlides = [];
		this.pauseAutoPlay = false;
        this.isLoaded = false;
        
		var UA = navigator.userAgent.toLowerCase();
		this.browser = {
			chrome: UA.match(/chrome/) ? true : false,
			firefox: UA.match(/firefox/) ? true : false,
			firefox2: UA.match(/firefox\/2/) ? true : false,
			firefox30: UA.match(/firefox\/3\.0/) ? true : false,
			msie: UA.match(/msie/) ? true : false,
			msie6: (UA.match(/msie 6/) && !UA.match(/msie 7|8/)) ? true : false,
			msie7: UA.match(/msie 7/) ? true : false,
			msie8: UA.match(/msie 8/) ? true : false,
            chromeFrame: (UA.match(/msie/) && UA.match(/chrome/)) ? true : false,
			opera: UA.match(/opera/) ? true : false,
			safari: (UA.match(/safari/) && !UA.match(/chrome/)) ? true : false
		};
		for(var b in this.browser){
			if(this.browser[b] === true){
				this.browser._this = b;
			}
		}
		if(this.browser.chrome === true) {
			this.browser.version = UA.match(/chrome\/([0-9\.]+)/)[1];
		}
		if(this.browser.firefox === true) {
			this.browser.version = UA.match(/firefox\/([0-9\.]+)/)[1];
		}
		if(this.browser.msie === true) {
			this.browser.version = UA.match(/msie ([0-9\.]+)/)[1];
		}
		if(this.browser.opera === true) {
			this.browser.version = UA.match(/version\/([0-9\.]+)/)[1];
		}
		if(this.browser.safari === true) {
			this.browser.version = UA.match(/version\/([0-9\.]+)/)[1];
		}
		
		var width;
		var height;

		var spine_inner_width,
			spine_outer_width,
			slide_width,
			spine_half_width;
		
		var FixIEAA = function(spine){
			if(self.browser.msie && !self.browser.chromeFrame){
				var bgColor = spine.css('background-color');
				var sBgColor = bgColor;
				if(sBgColor == "transparent"){
					bgColor = "#ffffff";
				} else {
					if(sBgColor.match('#')){
						// Hex, convert to RGB
						if(sBgColor.length < 7){
							var t = "#" + sBgColor.substr(1,1) + sBgColor.substr(1,1) + sBgColor.substr(2,1) + sBgColor.substr(2,1) + sBgColor.substr(3,1) + sBgColor.substr(3,1);
							bgColor = t;
						}
					}
				}
				bgColor = bgColor.replace("#","");
				cParts = {
					r: bgColor.substr(0,2),
					g: bgColor.substr(2,2),
					b: bgColor.substr(4,2)
				};
				var bgRGB = "#";
				var hexVal = "01234567890ABCDEF";
				for(var k in cParts){
					cParts[k] = Math.max(0,(parseInt(cParts[k],16) - 1));
					cParts[k] = hexVal.charAt((cParts[k] - cParts[k]%16)/16) + hexVal.charAt(cParts[k]%16);
					
					bgRGB += cParts[k];
				}
				
				spine.find('.' + self.classes.index).css({
					'filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1) chroma(color=' + bgRGB + ')',
					backgroundColor: bgRGB
				});
			}
		};
		
		
        /**
         * Visual Attribution "Bug"
         * 
         * This is a visual "bug" that is placed in the lower right of the SlideDeck to give
         * visual recognition to SlideDeck and for us to see where any implementations that might
         * be worth placing in our community examples page reside. To help keep this plugin free 
         * we ask (although we cannot force) you to keep this visual "bug" on the page since it 
         * helps support the author.
         * 
         * If you would like to remove the visual "bug", we recommend you comment out the 
         * updateBug(); function and remove any references to the updateBug(); command.
         */
/*
		var BUG = {
			id: "SlideDeck_Bug"+(Math.round(Math.random()*100000000)),
			styles: "position:absolute !important;height:"+13+"px !important;width:"+130+"px !important;display:block !important;margin:0 !important;overflow:hidden !important;visibility:visible !important;opacity:1 !important;padding:0 !important;z-index:20000 !important",
			width: 130,
			height: 13
		};
*/		
		// var updateBug = function(){
			// if(!document.getElementById(BUG.id)){
				// var bugLink = document.createElement('A');
					// bugLink.id = BUG.id;
					// bugLink.href = "http://www.slidedeck.com/?ref=" + document.location.hostname;
					// bugLink.target = "_blank";
				// var bugImg = document.createElement('IMG');
					// bugImg.src = (document.location.protocol == "https:" ? "https:" : "http:") + "//www.slidedeck.com/6885858486f31043e5839c735d99457f045affd0/" + VERSION + "/lite";
					// bugImg.alt = "Powered by SlideDeck&trade;";
					// bugImg.width = BUG.width;
					// bugImg.height = BUG.height;
					// bugImg.border = "0";
				// bugLink.appendChild(bugImg);
				
				// BUG.top = (el.offset().top + el.height() + 5);
				// BUG.left = el.offset().left + el.width() - BUG.width;

				// var s = document.createElement('STYLE');
					// s.type = "text/css";
				// var sText = '#' + BUG.id + '{top:' + BUG.top + 'px;left:' + BUG.left + 'px;' + BUG.styles + '}' + '#' + BUG.id + ' img{top:0 !important;left:0 !important;' + BUG.styles + '}';
				// if(s.styleSheet){
					// s.styleSheet.cssText = sText;
				// } else {
					// s.appendChild(document.createTextNode(sText));
				// }
				// $('head').append(s);
				
				// if(Math.random() < 0.5){
                    // $(document.body).prepend(bugLink);
                // } else {
                    // $(document.body).append(bugLink);
                // }

				// $(window).resize(function(){
					// updateBug();
				// });
			// }
			// BUG.top = (el.offset().top + el.height() + 5);
			// BUG.left = el.offset().left + el.width() - BUG.width;

			// $('#' + BUG.id).css({
				// top: BUG.top + "px",
				// left: BUG.left + "px"
			// });
		// };
		
		
		var autoPlay = function(){
			gotoNext = function(){
				if(self.pauseAutoPlay === false){
					if(self.options.cycle === false && self.current == self.slides.length){
						self.pauseAutoPlay = true;
					} else {
						self.next();
					}
				}
			};
			
			setInterval(gotoNext,self.options.autoPlayInterval);
		};
		
		
		var buildDeck = function(){
			if($.inArray(el.css('position'),['position','absolute','fixed'])){
				el.css('position', 'relative');
			}
			el.css('overflow', 'hidden');
			for(var i=0; i<self.slides.length; i++){
				var slide = $(self.slides[i]);
				if(self.spines.length > i){
					var spine = $(self.spines[i]);
				}
				var sPad = {
					top: parseInt(slide.css('padding-top'),10),
					right: parseInt(slide.css('padding-right'),10),
					bottom: parseInt(slide.css('padding-bottom'),10),
					left: parseInt(slide.css('padding-left'),10)
				};
				var sBorder = {
					top: parseInt(slide.css('border-top-width'),10),
					right: parseInt(slide.css('border-right-width'),10),
					bottom: parseInt(slide.css('border-bottom-width'),10),
					left: parseInt(slide.css('border-left-width'),10)
				};
				for(var k in sBorder){
					sBorder[k] = isNaN(sBorder[k]) ? 0 : sBorder[k];
				}
				if(i < self.current) {
					if(i == self.current - 1){
						if(self.options.hideSpines !== true){
							spine.addClass(self.classes.active);
						}
						slide.addClass(self.classes.active);
					}
					offset = i * spine_outer_width;
					if(self.options.hideSpines === true){
						offset = 0 - (i * el.width());
					}
				} else {
					offset = i * spine_outer_width + slide_width;
					if(self.options.hideSpines === true){
						offset = i * el.width();
					}
				}
				
                self.slide_width = (slide_width - sPad.left - sPad.right - sBorder.left - sBorder.right);
                
				slide.css({
					position: 'absolute',
					left: offset,
					zIndex: 1,
					height: (height - sPad.top - sPad.bottom - sBorder.top - sBorder.bottom) + "px",
					width: self.slide_width + "px",
					margin: 0,
					paddingLeft: sPad.left + spine_outer_width + "px"
				}).addClass(self.classes.slide).addClass(self.classes.slide + "_" + (i + 1));
				
				if (self.options.hideSpines !== true) {
                    var spinePad = {
    					top: parseInt(spine.css('padding-top'),10),
    					right: parseInt(spine.css('padding-right'),10),
    					bottom: parseInt(spine.css('padding-bottom'),10),
    					left: parseInt(spine.css('padding-left'),10)
                    };
                    for(var k in spinePad) {
                        if(spinePad[k] < 10 && (k == "left" || k == "right")){
                            spinePad[k] = 10;
                        }
                    }
                    var spinePadString = spinePad.top + "px " + spinePad.right + "px " + spinePad.bottom + "px " + spinePad.left + "px";
					spine.css({
						position: 'absolute',
						zIndex: 3,
						display: 'block',
						left: offset,
						width: (height - spinePad.left - spinePad.right) + "px",
						height: spine_inner_width + "px",
						padding: spinePadString,
						rotation: '270deg',
						'-webkit-transform': 'rotate(270deg)',
						'-webkit-transform-origin': spine_half_width + 'px 0px',
						'-moz-transform': 'rotate(270deg)',
						'-moz-transform-origin': spine_half_width + 'px 0px',
						'-o-transform': 'rotate(270deg)',
						'-o-transform-origin': spine_half_width + 'px 0px',
						textAlign: 'right',
						top: (self.browser.msie && !self.browser.chromeFrame) ? 0 : (height - spine_half_width) + "px",
						marginLeft: ((self.browser.msie && !self.browser.chromeFrame) ? 0 : (0 - spine_half_width)) + "px",
						filter: 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)'
					}).addClass(self.classes.spine).addClass(self.classes.spine + "_" + (i + 1));
				} else {
					if(typeof(spine) != "undefined"){
						spine.hide();
					}
				}
				if(i == self.slides.length-1){
					slide.addClass('last');
					if(self.options.hideSpines !== true){
						spine.addClass('last');
					}
				}
				
				// Add slide active corners
				if(self.options.activeCorner === true && self.options.hideSpines === false){
					var corner = document.createElement('DIV');
						corner.className = self.classes.activeCorner + ' ' + (self.classes.spine + '_' + (i + 1));
					
					spine.after(corner);
					spine.next('.' + self.classes.activeCorner).css({
						position: 'absolute',
						top: '25px',
						left: offset + spine_outer_width + "px",
						overflow: "hidden",
						zIndex: "20000"
					}).hide();
					if(spine.hasClass(self.classes.active)){
						spine.next('.' + self.classes.activeCorner).show();
					}
				}
				
                if (self.options.hideSpines !== true) {
    				// Add spine indexes, will always be numerical if unlicensed
    				var index = document.createElement('DIV');
    					index.className = self.classes.index;
    					
    				if(self.options.index !== false){
    					var textNode;
    					if(typeof(self.options.index) != 'boolean'){
    						textNode = self.options.index[i%self.options.index.length];
    					} else {
    						textNode = "" + (i + 1);
    					}
    					index.appendChild(document.createTextNode(textNode));
    				}
    						
                    spine.append(index);
                    spine.find('.' + self.classes.index).css({
                        position: 'absolute',
                        zIndex: 2,
                        display: 'block',
                        width: spine_inner_width + "px",
                        height: spine_inner_width + "px",
                        textAlign: 'center',
                        bottom: ((self.browser.msie && !self.browser.chromeFrame) ? 0 : (0 - spine_half_width)) + "px",
                        left: ((self.browser.msie && !self.browser.chromeFrame) ? 5 : 20) + "px",
                        rotation: "90deg",
                        '-webkit-transform': 'rotate(90deg)',
                        '-webkit-transform-origin': spine_half_width + 'px 0px',
                        '-moz-transform': 'rotate(90deg)',
                        '-moz-transform-origin': spine_half_width + 'px 0px',
                        '-o-transform': 'rotate(90deg)',
                        '-o-transform-origin': spine_half_width + 'px 0px'
                    });

					FixIEAA(spine);
				}
			}
			
			// updateBug();
			
			if(self.options.hideSpines !== true){
				// Setup Click Interaction
				self.spines.bind('click', function(event){
					event.preventDefault();
					self.goTo(self.spines.index(this)+1);
				});
  			}
			
			// Setup Keyboard Interaction
			if(self.options.keys !== false){
				$(document).bind('keydown', function(event){
					if($(event.target).parents().index(self.deck) == -1){
						if(event.keyCode == 39) {
							self.next();
						} else if(event.keyCode == 37) {
							self.prev();
						}
					}
				});
			}
			
			// Setup Mouse Wheel Interaction
			if(typeof($.event.special.mousewheel) != "undefined"){
				el.bind("mousewheel", function(event){
					if(self.options.scroll !== false){
                        var delta = event.detail ? event.detail : event.wheelDelta;
						if(self.browser.msie || self.browser.safari || self.browser.chrome){
							delta = 0 - delta;
						}

						var internal = false;
						if($(event.originalTarget).parents(self.deck).length){
							if($.inArray(event.originalTarget.nodeName.toLowerCase(),['input','select','option','textarea']) != -1){
								internal = true;
							}
						}

						if (internal !== true) {
							if (delta > 0) {
								switch (self.options.scroll) {
									case "stop":
										event.preventDefault();
										break;
									case true:
									default:
										if (self.current < self.slides.length) {
											event.preventDefault();
										}
									break;
								}
								self.next();
							}
							else {
								switch (self.options.scroll) {
									case "stop":
										event.preventDefault();
										break;
									case true:
									default:
										if (self.current != 1) {
											event.preventDefault();
										}
									break;
								}
								self.prev();
							}
						}
					}	
				});
			}
            
            $(self.spines[self.current - 2]).addClass(self.classes.previous);
            $(self.spines[self.current]).addClass(self.classes.next);

			if(self.options.autoPlay === true){
				autoPlay();
			}
            self.isLoaded = true;
		};
		
		
		var getValidSlide = function(ind){
			ind = Math.min(self.slides.length,Math.max(1,ind));
			return ind;
		};


		var slide = function(ind,params){
			ind = getValidSlide(ind);
			
			// Determine if we are moving forward in the SlideDeck or backward, 
			// this is used to determine when the callback should be run
			var forward = true;
			if(ind < self.current){
				forward = false;
			}
			
            var classReset = [self.classes.active, self.classes.next, self.classes.previous].join(' ');
			self.current = ind;
			self.spines.removeClass(classReset);
			self.slides.removeClass(classReset);
			el.find('.' + self.classes.activeCorner).hide();
            
            $(self.spines[self.current - 2]).addClass(self.classes.previous);
            $(self.spines[self.current]).addClass(self.classes.next);
            
			for (var i = 0; i < self.slides.length; i++) {
				var pos = 0;
				if(self.options.hideSpines !== true){
					var spine = $(self.spines[i]);
				}
				var slide = $(self.slides[i]);
				if (i < self.current) {
					if (i == (self.current - 1)) {
						slide.addClass(self.classes.active);
						if(self.options.hideSpines !== true){
							spine.addClass(self.classes.active);
							spine.next('.' + self.classes.activeCorner).show();
						}
					}
					pos = i * spine_outer_width;
				} else {
					pos = i * spine_outer_width + slide_width;
				}
				
				if(self.options.hideSpines === true){
					pos = (i - self.current + 1) * el.width();
				}

				var animOpts = {
					duration: self.options.speed,
					easing: self.options.transition
				};

				slide.stop().animate({
					left: pos + "px",
                    width: self.slide_width + "px"
				}, animOpts);

				if(self.options.hideSpines !== true){
					FixIEAA(spine);
					if(spine.css('left') != pos+"px"){
						spine.stop().animate({
							left: pos + "px"
						},{
							duration: self.options.speed,
							easing: self.options.transition
						});

						spine.next('.' + self.classes.activeCorner).stop().animate({
							left: pos + spine_outer_width + "px"
						},{
							duration: self.options.speed,
							easing: self.options.transition
						});
					}
				}
				
			}
			// updateBug();
		};
        
        
        var setOption = function(opts, val){
            var newOpts = opts;
            
            if(typeof(opts) === "string"){
                newOpts = {};
                newOpts[opts] = val;
            }
            
            for(var key in newOpts){
                val = newOpts[key];
                
                switch(key){
                    case "speed":
                    case "start":
                        val = parseFloat(val);
                        if(isNaN(val)){
                            val = self.options[key];
                        }
                    break;                    
                    case "scroll":
                    case "keys":
                    case "activeCorner":
                    case "hideSpines":
                    case "autoPlay":
                    case "cycle":
                        if(typeof(val) !== "boolean"){
                            val = self.options[key];
                        }
                    break;                    
                    case "transition":
                        if(typeof(val) !== "string"){
                            val = self.options[key];
                        }
                    break;
                    case "complete":
                    case "before":
                        if(typeof(val) !== "function"){
                            val = self.options[key];
                        }
                    break;
                    case "index":
                        if(typeof(val) !== "boolean"){
                            if(!$.isArray(val)){
                                val = self.options[key];
                            }
                        }
                    break;                    
                }
                
                self.options[key] = val;
            }
        };
		
		
        var setupDimensions = function(){
    		height = el.height();
    		width = el.width();

            el.css('height', height + "px");
    
    		spine_inner_width = 0;
    		spine_outer_width = 0;

			if(self.options.hideSpines !== true && self.spines.length > 0){
				spine_inner_width = $(self.spines[0]).height();
				spine_outer_width = $(self.spines[0]).outerHeight();
			}
            
			slide_width = width - spine_outer_width*self.spines.length;
            if(self.options.hideSpines === true){
                slide_width = width;
            }
            
			spine_half_width = Math.ceil(spine_inner_width/2);
        };
        
        
		var initialize = function(opts){
			if((self.browser.opera && self.browser.version < "10.5") || self.browser.msie6 || self.browser.firefox2 || self.browser.firefox30){
				if(typeof(console) != "undefined"){
					if(typeof(console.error) == "function"){
						console.error("This web browser is not supported by SlideDeck. Please view this page in a modern, CSS3 capable browser or a current version of Inernet Explorer");
					}
				}
				return false;
			}
            
            if(typeof(opts) != "undefined"){
				for(var key in opts){
					self.options[key] = opts[key];
				}
			}
			if(self.spines.length < 1){
				self.options.hideSpines = true;
			}
			if(self.options.hideSpines === true){
				self.options.activeCorner = false;
			}
		
			self.current = Math.min(self.slides.length,Math.max(1,self.options.start));
            
            if(el.height() > 0){
                setupDimensions();
                buildDeck();
            } else {
                var startupTimer;
                startupTimer = setTimeout(function(){
                    setupDimensions();
                    if(el.height() > 0){
                        clearInterval(startupTimer);
                        setupDimensions();
                        buildDeck();
                    }
                }, 20);
            }
		};
        
        
        var loaded = function(func){
            var thisTimer;
            thisTimer = setInterval(function(){
                if(self.isLoaded == true){
                    clearInterval(thisTimer);
                    func();
                }
            }, 20);
        };
        
        
        this.loaded = function(func){
            loaded(func);
                        
            return self;
        };
		
		
		this.next = function(params){
			var nextSlide = Math.min(self.slides.length,(self.current + 1));
			if(self.options.cycle === true){
				if(self.current + 1 > self.slides.length){
					nextSlide = 1;
				}
			}
			slide(nextSlide,params);
			return self;
		};
		
		this.prev = function(params){
			var prevSlide = Math.max(1,(self.current - 1));
			if(self.options.cycle === true){
				if(self.current - 1 < 1){
					prevSlide = self.slides.length;
				}
			}
			slide(prevSlide,params);
			return self;
		};
		
		this.goTo = function(ind,params){
			self.pauseAutoPlay = true;
			slide(Math.min(self.slides.length,Math.max(1,ind)),params);
			return self;
		};
		
        this.setOption = function(opts,val){
            setOption(opts,val);
            return self;
        };
		
		initialize(opts);
	};
	
	$.fn.slidedeck = function(opts){
		var returnArr = [];
		for(var i=0; i<this.length; i++){
			if(!this[i].slidedeck){
				this[i].slidedeck = new SlideDeck(this[i],opts);
			}
			returnArr.push(this[i].slidedeck);
		}
		return returnArr.length > 1 ? returnArr : returnArr[0];
	};
})(jQuery);
















































/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('h.i[\'1a\']=h.i[\'z\'];h.O(h.i,{y:\'D\',z:9(x,t,b,c,d){6 h.i[h.i.y](x,t,b,c,d)},17:9(x,t,b,c,d){6 c*(t/=d)*t+b},D:9(x,t,b,c,d){6-c*(t/=d)*(t-2)+b},13:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t+b;6-c/2*((--t)*(t-2)-1)+b},X:9(x,t,b,c,d){6 c*(t/=d)*t*t+b},U:9(x,t,b,c,d){6 c*((t=t/d-1)*t*t+1)+b},R:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t+b;6 c/2*((t-=2)*t*t+2)+b},N:9(x,t,b,c,d){6 c*(t/=d)*t*t*t+b},M:9(x,t,b,c,d){6-c*((t=t/d-1)*t*t*t-1)+b},L:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t*t+b;6-c/2*((t-=2)*t*t*t-2)+b},K:9(x,t,b,c,d){6 c*(t/=d)*t*t*t*t+b},J:9(x,t,b,c,d){6 c*((t=t/d-1)*t*t*t*t+1)+b},I:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t*t*t+b;6 c/2*((t-=2)*t*t*t*t+2)+b},G:9(x,t,b,c,d){6-c*8.C(t/d*(8.g/2))+c+b},15:9(x,t,b,c,d){6 c*8.n(t/d*(8.g/2))+b},12:9(x,t,b,c,d){6-c/2*(8.C(8.g*t/d)-1)+b},Z:9(x,t,b,c,d){6(t==0)?b:c*8.j(2,10*(t/d-1))+b},Y:9(x,t,b,c,d){6(t==d)?b+c:c*(-8.j(2,-10*t/d)+1)+b},W:9(x,t,b,c,d){e(t==0)6 b;e(t==d)6 b+c;e((t/=d/2)<1)6 c/2*8.j(2,10*(t-1))+b;6 c/2*(-8.j(2,-10*--t)+2)+b},V:9(x,t,b,c,d){6-c*(8.o(1-(t/=d)*t)-1)+b},S:9(x,t,b,c,d){6 c*8.o(1-(t=t/d-1)*t)+b},Q:9(x,t,b,c,d){e((t/=d/2)<1)6-c/2*(8.o(1-t*t)-1)+b;6 c/2*(8.o(1-(t-=2)*t)+1)+b},P:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d)==1)6 b+c;e(!p)p=d*.3;e(a<8.w(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);6-(a*8.j(2,10*(t-=1))*8.n((t*d-s)*(2*8.g)/p))+b},H:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d)==1)6 b+c;e(!p)p=d*.3;e(a<8.w(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);6 a*8.j(2,-10*t)*8.n((t*d-s)*(2*8.g)/p)+c+b},T:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d/2)==2)6 b+c;e(!p)p=d*(.3*1.5);e(a<8.w(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);e(t<1)6-.5*(a*8.j(2,10*(t-=1))*8.n((t*d-s)*(2*8.g)/p))+b;6 a*8.j(2,-10*(t-=1))*8.n((t*d-s)*(2*8.g)/p)*.5+c+b},F:9(x,t,b,c,d,s){e(s==u)s=1.l;6 c*(t/=d)*t*((s+1)*t-s)+b},E:9(x,t,b,c,d,s){e(s==u)s=1.l;6 c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},16:9(x,t,b,c,d,s){e(s==u)s=1.l;e((t/=d/2)<1)6 c/2*(t*t*(((s*=(1.B))+1)*t-s))+b;6 c/2*((t-=2)*t*(((s*=(1.B))+1)*t+s)+2)+b},A:9(x,t,b,c,d){6 c-h.i.v(x,d-t,0,c,d)+b},v:9(x,t,b,c,d){e((t/=d)<(1/2.k)){6 c*(7.q*t*t)+b}m e(t<(2/2.k)){6 c*(7.q*(t-=(1.5/2.k))*t+.k)+b}m e(t<(2.5/2.k)){6 c*(7.q*(t-=(2.14/2.k))*t+.11)+b}m{6 c*(7.q*(t-=(2.18/2.k))*t+.19)+b}},1b:9(x,t,b,c,d){e(t<d/2)6 h.i.A(x,t*2,0,c,d)*.5+b;6 h.i.v(x,t*2-d,0,c,d)*.5+c*.5+b}});',62,74,'||||||return||Math|function|||||if|var|PI|jQuery|easing|pow|75|70158|else|sin|sqrt||5625|asin|||undefined|easeOutBounce|abs||def|swing|easeInBounce|525|cos|easeOutQuad|easeOutBack|easeInBack|easeInSine|easeOutElastic|easeInOutQuint|easeOutQuint|easeInQuint|easeInOutQuart|easeOutQuart|easeInQuart|extend|easeInElastic|easeInOutCirc|easeInOutCubic|easeOutCirc|easeInOutElastic|easeOutCubic|easeInCirc|easeInOutExpo|easeInCubic|easeOutExpo|easeInExpo||9375|easeInOutSine|easeInOutQuad|25|easeOutSine|easeInOutBack|easeInQuad|625|984375|jswing|easeInOutBounce'.split('|'),0,{}))

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
















































/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 *
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function($) {
	var tmp, loading, overlay, wrap, outer, content, close, title, nav_left, nav_right,

		selectedIndex = 0, selectedOpts = {}, selectedArray = [], currentIndex = 0, currentOpts = {}, currentArray = [],

		ajaxLoader = null, imgPreloader = new Image(), imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, swfRegExp = /[^\.]\.(swf)\s*$/i,

		loadingTimer, loadingFrame = 1,

		titleHeight = 0, titleStr = '', start_pos, final_pos, busy = false, fx = $.extend($('<div/>')[0], { prop: 0 }),

		isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest,

		/*
		 * Private methods 
		 */

		_abort = function() {
			loading.hide();

			imgPreloader.onerror = imgPreloader.onload = null;

			if (ajaxLoader) {
				ajaxLoader.abort();
			}

			tmp.empty();
		},

		_error = function() {
			if (false === selectedOpts.onError(selectedArray, selectedIndex, selectedOpts)) {
				loading.hide();
				busy = false;
				return;
			}

			selectedOpts.titleShow = false;

			selectedOpts.width = 'auto';
			selectedOpts.height = 'auto';

			tmp.html( '<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>' );

			_process_inline();
		},

		_start = function() {
			var obj = selectedArray[ selectedIndex ],
				href, 
				type, 
				title,
				str,
				emb,
				ret;

			_abort();

			selectedOpts = $.extend({}, $.fn.fancybox.defaults, (typeof $(obj).data('fancybox') == 'undefined' ? selectedOpts : $(obj).data('fancybox')));

			ret = selectedOpts.onStart(selectedArray, selectedIndex, selectedOpts);

			if (ret === false) {
				busy = false;
				return;
			} else if (typeof ret == 'object') {
				selectedOpts = $.extend(selectedOpts, ret);
			}

			title = selectedOpts.title || (obj.nodeName ? $(obj).attr('title') : obj.title) || '';

			if (obj.nodeName && !selectedOpts.orig) {
				selectedOpts.orig = $(obj).children("img:first").length ? $(obj).children("img:first") : $(obj);
			}

			if (title === '' && selectedOpts.orig && selectedOpts.titleFromAlt) {
				title = selectedOpts.orig.attr('alt');
			}

			href = selectedOpts.href || (obj.nodeName ? $(obj).attr('href') : obj.href) || null;

			if ((/^(?:javascript)/i).test(href) || href == '#') {
				href = null;
			}

			if (selectedOpts.type) {
				type = selectedOpts.type;

				if (!href) {
					href = selectedOpts.content;
				}

			} else if (selectedOpts.content) {
				type = 'html';

			} else if (href) {
				if (href.match(imgRegExp)) {
					type = 'image';

				} else if (href.match(swfRegExp)) {
					type = 'swf';

				} else if ($(obj).hasClass("iframe")) {
					type = 'iframe';

				} else if (href.indexOf("#") === 0) {
					type = 'inline';

				} else {
					type = 'ajax';
				}
			}

			if (!type) {
				_error();
				return;
			}

			if (type == 'inline') {
				obj	= href.substr(href.indexOf("#"));
				type = $(obj).length > 0 ? 'inline' : 'ajax';
			}

			selectedOpts.type = type;
			selectedOpts.href = href;
			selectedOpts.title = title;

			if (selectedOpts.autoDimensions) {
				if (selectedOpts.type == 'html' || selectedOpts.type == 'inline' || selectedOpts.type == 'ajax') {
					selectedOpts.width = 'auto';
					selectedOpts.height = 'auto';
				} else {
					selectedOpts.autoDimensions = false;	
				}
			}

			if (selectedOpts.modal) {
				selectedOpts.overlayShow = true;
				selectedOpts.hideOnOverlayClick = false;
				selectedOpts.hideOnContentClick = false;
				selectedOpts.enableEscapeButton = false;
				selectedOpts.showCloseButton = false;
			}

			selectedOpts.padding = parseInt(selectedOpts.padding, 10);
			selectedOpts.margin = parseInt(selectedOpts.margin, 10);

			tmp.css('padding', (selectedOpts.padding + selectedOpts.margin));

			$('.fancybox-inline-tmp').unbind('fancybox-cancel').bind('fancybox-change', function() {
				$(this).replaceWith(content.children());				
			});

			switch (type) {
				case 'html' :
					tmp.html( selectedOpts.content );
					_process_inline();
				break;

				case 'inline' :
					if ( $(obj).parent().is('#fancybox-content') === true) {
						busy = false;
						return;
					}

					$('<div class="fancybox-inline-tmp" />')
						.hide()
						.insertBefore( $(obj) )
						.bind('fancybox-cleanup', function() {
							$(this).replaceWith(content.children());
						}).bind('fancybox-cancel', function() {
							$(this).replaceWith(tmp.children());
						});

					$(obj).appendTo(tmp);

					_process_inline();
				break;

				case 'image':
					busy = false;

					$.fancybox.showActivity();

					imgPreloader = new Image();

					imgPreloader.onerror = function() {
						_error();
					};

					imgPreloader.onload = function() {
						busy = true;

						imgPreloader.onerror = imgPreloader.onload = null;

						_process_image();
					};

					imgPreloader.src = href;
				break;

				case 'swf':
					selectedOpts.scrolling = 'no';

					str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + href + '"></param>';
					emb = '';

					$.each(selectedOpts.swf, function(name, val) {
						str += '<param name="' + name + '" value="' + val + '"></param>';
						emb += ' ' + name + '="' + val + '"';
					});

					str += '<embed src="' + href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

					tmp.html(str);

					_process_inline();
				break;

				case 'ajax':
					busy = false;

					$.fancybox.showActivity();

					selectedOpts.ajax.win = selectedOpts.ajax.success;

					ajaxLoader = $.ajax($.extend({}, selectedOpts.ajax, {
						url	: href,
						data : selectedOpts.ajax.data || {},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							if ( XMLHttpRequest.status > 0 ) {
								_error();
							}
						},
						success : function(data, textStatus, XMLHttpRequest) {
							var o = typeof XMLHttpRequest == 'object' ? XMLHttpRequest : ajaxLoader;
							if (o.status == 200) {
								if ( typeof selectedOpts.ajax.win == 'function' ) {
									ret = selectedOpts.ajax.win(href, data, textStatus, XMLHttpRequest);

									if (ret === false) {
										loading.hide();
										return;
									} else if (typeof ret == 'string' || typeof ret == 'object') {
										data = ret;
									}
								}

								tmp.html( data );
								_process_inline();
							}
						}
					}));

				break;

				case 'iframe':
					_show();
				break;
			}
		},

		_process_inline = function() {
			var
				w = selectedOpts.width,
				h = selectedOpts.height;

			if (w.toString().indexOf('%') > -1) {
				w = parseInt( ($(window).width() - (selectedOpts.margin * 2)) * parseFloat(w) / 100, 10) + 'px';

			} else {
				w = w == 'auto' ? 'auto' : w + 'px';	
			}

			if (h.toString().indexOf('%') > -1) {
				h = parseInt( ($(window).height() - (selectedOpts.margin * 2)) * parseFloat(h) / 100, 10) + 'px';

			} else {
				h = h == 'auto' ? 'auto' : h + 'px';	
			}

			tmp.wrapInner('<div style="width:' + w + ';height:' + h + ';overflow: ' + (selectedOpts.scrolling == 'auto' ? 'auto' : (selectedOpts.scrolling == 'yes' ? 'scroll' : 'hidden')) + ';position:relative;"></div>');

			selectedOpts.width = tmp.width();
			selectedOpts.height = tmp.height();

			_show();
		},

		_process_image = function() {
			selectedOpts.width = imgPreloader.width;
			selectedOpts.height = imgPreloader.height;

			$("<img />").attr({
				'id' : 'fancybox-img',
				'src' : imgPreloader.src,
				'alt' : selectedOpts.title
			}).appendTo( tmp );

			_show();
		},

		_show = function() {
			var pos, equal;

			loading.hide();

			if (wrap.is(":visible") && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
				$.event.trigger('fancybox-cancel');

				busy = false;
				return;
			}

			busy = true;

			$(content.add( overlay )).unbind();

			$(window).unbind("resize.fb scroll.fb");
			$(document).unbind('keydown.fb');

			if (wrap.is(":visible") && currentOpts.titlePosition !== 'outside') {
				wrap.css('height', wrap.height());
			}

			currentArray = selectedArray;
			currentIndex = selectedIndex;
			currentOpts = selectedOpts;

			if (currentOpts.overlayShow) {
				overlay.css({
					'background-color' : currentOpts.overlayColor,
					'opacity' : currentOpts.overlayOpacity,
					'cursor' : currentOpts.hideOnOverlayClick ? 'pointer' : 'auto',
					'height' : $(document).height()
				});

				if (!overlay.is(':visible')) {
					if (isIE6) {
						$('select:not(#fancybox-tmp select)').filter(function() {
							return this.style.visibility !== 'hidden';
						}).css({'visibility' : 'hidden'}).one('fancybox-cleanup', function() {
							this.style.visibility = 'inherit';
						});
					}

					overlay.show();
				}
			} else {
				overlay.hide();
			}

			final_pos = _get_zoom_to();

			_process_title();

			if (wrap.is(":visible")) {
				$( close.add( nav_left ).add( nav_right ) ).hide();

				pos = wrap.position(),

				start_pos = {
					top	 : pos.top,
					left : pos.left,
					width : wrap.width(),
					height : wrap.height()
				};

				equal = (start_pos.width == final_pos.width && start_pos.height == final_pos.height);

				content.fadeTo(currentOpts.changeFade, 0.3, function() {
					var finish_resizing = function() {
						content.html( tmp.contents() ).fadeTo(currentOpts.changeFade, 1, _finish);
					};

					$.event.trigger('fancybox-change');

					content
						.empty()
						.removeAttr('filter')
						.css({
							'border-width' : currentOpts.padding,
							'width'	: final_pos.width - currentOpts.padding * 2,
							'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
						});

					if (equal) {
						finish_resizing();

					} else {
						fx.prop = 0;

						$(fx).animate({prop: 1}, {
							 duration : currentOpts.changeSpeed,
							 easing : currentOpts.easingChange,
							 step : _draw,
							 complete : finish_resizing
						});
					}
				});

				return;
			}

			wrap.removeAttr("style");

			content.css('border-width', currentOpts.padding);

			if (currentOpts.transitionIn == 'elastic') {
				start_pos = _get_zoom_from();

				content.html( tmp.contents() );

				wrap.show();

				if (currentOpts.opacity) {
					final_pos.opacity = 0;
				}

				fx.prop = 0;

				$(fx).animate({prop: 1}, {
					 duration : currentOpts.speedIn,
					 easing : currentOpts.easingIn,
					 step : _draw,
					 complete : _finish
				});

				return;
			}

			if (currentOpts.titlePosition == 'inside' && titleHeight > 0) {	
				title.show();	
			}

			content
				.css({
					'width' : final_pos.width - currentOpts.padding * 2,
					'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
				})
				.html( tmp.contents() );

			wrap
				.css(final_pos)
				.fadeIn( currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish );
		},

		_format_title = function(title) {
			if (title && title.length) {
				if (currentOpts.titlePosition == 'float') {
					return '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + title + '</td><td id="fancybox-title-float-right"></td></tr></table>';
				}

				return '<div id="fancybox-title-' + currentOpts.titlePosition + '">' + title + '</div>';
			}

			return false;
		},

		_process_title = function() {
			titleStr = currentOpts.title || '';
			titleHeight = 0;

			title
				.empty()
				.removeAttr('style')
				.removeClass();

			if (currentOpts.titleShow === false) {
				title.hide();
				return;
			}

			titleStr = $.isFunction(currentOpts.titleFormat) ? currentOpts.titleFormat(titleStr, currentArray, currentIndex, currentOpts) : _format_title(titleStr);

			if (!titleStr || titleStr === '') {
				title.hide();
				return;
			}

			title
				.addClass('fancybox-title-' + currentOpts.titlePosition)
				.html( titleStr )
				.appendTo( 'body' )
				.show();

			switch (currentOpts.titlePosition) {
				case 'inside':
					title
						.css({
							'width' : final_pos.width - (currentOpts.padding * 2),
							'marginLeft' : currentOpts.padding,
							'marginRight' : currentOpts.padding
						});

					titleHeight = title.outerHeight(true);

					title.appendTo( outer );

					final_pos.height += titleHeight;
				break;

				case 'over':
					title
						.css({
							'marginLeft' : currentOpts.padding,
							'width'	: final_pos.width - (currentOpts.padding * 2),
							'bottom' : currentOpts.padding
						})
						.appendTo( outer );
				break;

				case 'float':
					title
						.css('left', parseInt((title.width() - final_pos.width - 40)/ 2, 10) * -1)
						.appendTo( wrap );
				break;

				default:
					title
						.css({
							'width' : final_pos.width - (currentOpts.padding * 2),
							'paddingLeft' : currentOpts.padding,
							'paddingRight' : currentOpts.padding
						})
						.appendTo( wrap );
				break;
			}

			title.hide();
		},

		_set_navigation = function() {
			if (currentOpts.enableEscapeButton || currentOpts.enableKeyboardNav) {
				$(document).bind('keydown.fb', function(e) {
					if (e.keyCode == 27 && currentOpts.enableEscapeButton) {
						e.preventDefault();
						$.fancybox.close();

					} else if ((e.keyCode == 37 || e.keyCode == 39) && currentOpts.enableKeyboardNav && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
						e.preventDefault();
						$.fancybox[ e.keyCode == 37 ? 'prev' : 'next']();
					}
				});
			}

			if (!currentOpts.showNavArrows) { 
				nav_left.hide();
				nav_right.hide();
				return;
			}

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex !== 0) {
				nav_left.show();
			}

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex != (currentArray.length -1)) {
				nav_right.show();
			}
		},

		_finish = function () {
			if (!$.support.opacity) {
				content.get(0).style.removeAttribute('filter');
				wrap.get(0).style.removeAttribute('filter');
			}

			if (selectedOpts.autoDimensions) {
				content.css('height', 'auto');
			}

			wrap.css('height', 'auto');

			if (titleStr && titleStr.length) {
				title.show();
			}

			if (currentOpts.showCloseButton) {
				close.show();
			}

			_set_navigation();
	
			if (currentOpts.hideOnContentClick)	{
				content.bind('click', $.fancybox.close);
			}

			if (currentOpts.hideOnOverlayClick)	{
				overlay.bind('click', $.fancybox.close);
			}

			$(window).bind("resize.fb", $.fancybox.resize);

			if (currentOpts.centerOnScroll) {
				$(window).bind("scroll.fb", $.fancybox.center);
			}

			if (currentOpts.type == 'iframe') {
				$('<iframe id="fancybox-frame" name="fancybox-frame' + new Date().getTime() + '" frameborder="0" hspace="0" ' + ($.browser.msie ? 'allowtransparency="true""' : '') + ' scrolling="' + selectedOpts.scrolling + '" src="' + currentOpts.href + '"></iframe>').appendTo(content);
			}

			wrap.show();

			busy = false;

			$.fancybox.center();

			currentOpts.onComplete(currentArray, currentIndex, currentOpts);

			_preload_images();
		},

		_preload_images = function() {
			var href, 
				objNext;

			if ((currentArray.length -1) > currentIndex) {
				href = currentArray[ currentIndex + 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}

			if (currentIndex > 0) {
				href = currentArray[ currentIndex - 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}
		},

		_draw = function(pos) {
			var dim = {
				width : parseInt(start_pos.width + (final_pos.width - start_pos.width) * pos, 10),
				height : parseInt(start_pos.height + (final_pos.height - start_pos.height) * pos, 10),

				top : parseInt(start_pos.top + (final_pos.top - start_pos.top) * pos, 10),
				left : parseInt(start_pos.left + (final_pos.left - start_pos.left) * pos, 10)
			};

			if (typeof final_pos.opacity !== 'undefined') {
				dim.opacity = pos < 0.5 ? 0.5 : pos;
			}

			wrap.css(dim);

			content.css({
				'width' : dim.width - currentOpts.padding * 2,
				'height' : dim.height - (titleHeight * pos) - currentOpts.padding * 2
			});
		},

		_get_viewport = function() {
			return [
				$(window).width() - (currentOpts.margin * 2),
				$(window).height() - (currentOpts.margin * 2),
				$(document).scrollLeft() + currentOpts.margin,
				$(document).scrollTop() + currentOpts.margin
			];
		},

		_get_zoom_to = function () {
			var view = _get_viewport(),
				to = {},
				resize = currentOpts.autoScale,
				double_padding = currentOpts.padding * 2,
				ratio;

			if (currentOpts.width.toString().indexOf('%') > -1) {
				to.width = parseInt((view[0] * parseFloat(currentOpts.width)) / 100, 10);
			} else {
				to.width = currentOpts.width + double_padding;
			}

			if (currentOpts.height.toString().indexOf('%') > -1) {
				to.height = parseInt((view[1] * parseFloat(currentOpts.height)) / 100, 10);
			} else {
				to.height = currentOpts.height + double_padding;
			}

			if (resize && (to.width > view[0] || to.height > view[1])) {
				if (selectedOpts.type == 'image' || selectedOpts.type == 'swf') {
					ratio = (currentOpts.width ) / (currentOpts.height );

					if ((to.width ) > view[0]) {
						to.width = view[0];
						to.height = parseInt(((to.width - double_padding) / ratio) + double_padding, 10);
					}

					if ((to.height) > view[1]) {
						to.height = view[1];
						to.width = parseInt(((to.height - double_padding) * ratio) + double_padding, 10);
					}

				} else {
					to.width = Math.min(to.width, view[0]);
					to.height = Math.min(to.height, view[1]);
				}
			}

			to.top = parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - to.height - 40) * 0.5)), 10);
			to.left = parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - to.width - 40) * 0.5)), 10);

			return to;
		},

		_get_obj_pos = function(obj) {
			var pos = obj.offset();

			pos.top += parseInt( obj.css('paddingTop'), 10 ) || 0;
			pos.left += parseInt( obj.css('paddingLeft'), 10 ) || 0;

			pos.top += parseInt( obj.css('border-top-width'), 10 ) || 0;
			pos.left += parseInt( obj.css('border-left-width'), 10 ) || 0;

			pos.width = obj.width();
			pos.height = obj.height();

			return pos;
		},

		_get_zoom_from = function() {
			var orig = selectedOpts.orig ? $(selectedOpts.orig) : false,
				from = {},
				pos,
				view;

			if (orig && orig.length) {
				pos = _get_obj_pos(orig);

				from = {
					width : pos.width + (currentOpts.padding * 2),
					height : pos.height + (currentOpts.padding * 2),
					top	: pos.top - currentOpts.padding - 20,
					left : pos.left - currentOpts.padding - 20
				};

			} else {
				view = _get_viewport();

				from = {
					width : currentOpts.padding * 2,
					height : currentOpts.padding * 2,
					top	: parseInt(view[3] + view[1] * 0.5, 10),
					left : parseInt(view[2] + view[0] * 0.5, 10)
				};
			}

			return from;
		},

		_animate_loading = function() {
			if (!loading.is(':visible')){
				clearInterval(loadingTimer);
				return;
			}

			$('div', loading).css('top', (loadingFrame * -40) + 'px');

			loadingFrame = (loadingFrame + 1) % 12;
		};

	/*
	 * Public methods 
	 */

	$.fn.fancybox = function(options) {
		if (!$(this).length) {
			return this;
		}

		$(this)
			.data('fancybox', $.extend({}, options, ($.metadata ? $(this).metadata() : {})))
			.unbind('click.fb')
			.bind('click.fb', function(e) {
				e.preventDefault();

				if (busy) {
					return;
				}

				busy = true;

				$(this).blur();

				selectedArray = [];
				selectedIndex = 0;

				var rel = $(this).attr('rel') || '';

				if (!rel || rel == '' || rel === 'nofollow') {
					selectedArray.push(this);

				} else {
					selectedArray = $("a[rel=" + rel + "], area[rel=" + rel + "]");
					selectedIndex = selectedArray.index( this );
				}

				_start();

				return;
			});

		return this;
	};

	$.fancybox = function(obj) {
		var opts;

		if (busy) {
			return;
		}

		busy = true;
		opts = typeof arguments[1] !== 'undefined' ? arguments[1] : {};

		selectedArray = [];
		selectedIndex = parseInt(opts.index, 10) || 0;

		if ($.isArray(obj)) {
			for (var i = 0, j = obj.length; i < j; i++) {
				if (typeof obj[i] == 'object') {
					$(obj[i]).data('fancybox', $.extend({}, opts, obj[i]));
				} else {
					obj[i] = $({}).data('fancybox', $.extend({content : obj[i]}, opts));
				}
			}

			selectedArray = jQuery.merge(selectedArray, obj);

		} else {
			if (typeof obj == 'object') {
				$(obj).data('fancybox', $.extend({}, opts, obj));
			} else {
				obj = $({}).data('fancybox', $.extend({content : obj}, opts));
			}

			selectedArray.push(obj);
		}

		if (selectedIndex > selectedArray.length || selectedIndex < 0) {
			selectedIndex = 0;
		}

		_start();
	};

	$.fancybox.showActivity = function() {
		clearInterval(loadingTimer);

		loading.show();
		loadingTimer = setInterval(_animate_loading, 66);
	};

	$.fancybox.hideActivity = function() {
		loading.hide();
	};

	$.fancybox.next = function() {
		return $.fancybox.pos( currentIndex + 1);
	};

	$.fancybox.prev = function() {
		return $.fancybox.pos( currentIndex - 1);
	};

	$.fancybox.pos = function(pos) {
		if (busy) {
			return;
		}

		pos = parseInt(pos);

		selectedArray = currentArray;

		if (pos > -1 && pos < currentArray.length) {
			selectedIndex = pos;
			_start();

		} else if (currentOpts.cyclic && currentArray.length > 1) {
			selectedIndex = pos >= currentArray.length ? 0 : currentArray.length - 1;
			_start();
		}

		return;
	};

	$.fancybox.cancel = function() {
		if (busy) {
			return;
		}

		busy = true;

		$.event.trigger('fancybox-cancel');

		_abort();

		selectedOpts.onCancel(selectedArray, selectedIndex, selectedOpts);

		busy = false;
	};

	// Note: within an iframe use - parent.$.fancybox.close();
	$.fancybox.close = function() {
		if (busy || wrap.is(':hidden')) {
			return;
		}

		busy = true;

		if (currentOpts && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
			busy = false;
			return;
		}

		_abort();

		$(close.add( nav_left ).add( nav_right )).hide();

		$(content.add( overlay )).unbind();

		$(window).unbind("resize.fb scroll.fb");
		$(document).unbind('keydown.fb');

		content.find('iframe').attr('src', isIE6 && /^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank');

		if (currentOpts.titlePosition !== 'inside') {
			title.empty();
		}

		wrap.stop();

		function _cleanup() {
			overlay.fadeOut('fast');

			title.empty().hide();
			wrap.hide();

			$.event.trigger('fancybox-cleanup');

			content.empty();

			currentOpts.onClosed(currentArray, currentIndex, currentOpts);

			currentArray = selectedOpts	= [];
			currentIndex = selectedIndex = 0;
			currentOpts = selectedOpts	= {};

			busy = false;
		}

		if (currentOpts.transitionOut == 'elastic') {
			start_pos = _get_zoom_from();

			var pos = wrap.position();

			final_pos = {
				top	 : pos.top ,
				left : pos.left,
				width :	wrap.width(),
				height : wrap.height()
			};

			if (currentOpts.opacity) {
				final_pos.opacity = 1;
			}

			title.empty().hide();

			fx.prop = 1;

			$(fx).animate({ prop: 0 }, {
				 duration : currentOpts.speedOut,
				 easing : currentOpts.easingOut,
				 step : _draw,
				 complete : _cleanup
			});

		} else {
			wrap.fadeOut( currentOpts.transitionOut == 'none' ? 0 : currentOpts.speedOut, _cleanup);
		}
	};

	$.fancybox.resize = function() {
		if (overlay.is(':visible')) {
			overlay.css('height', $(document).height());
		}

		$.fancybox.center(true);
	};

	$.fancybox.center = function() {
		var view, align;

		if (busy) {
			return;	
		}

		align = arguments[0] === true ? 1 : 0;
		view = _get_viewport();

		if (!align && (wrap.width() > view[0] || wrap.height() > view[1])) {
			return;	
		}

		wrap
			.stop()
			.animate({
				'top' : parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - content.height() - 40) * 0.5) - currentOpts.padding)),
				'left' : parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - content.width() - 40) * 0.5) - currentOpts.padding))
			}, typeof arguments[0] == 'number' ? arguments[0] : 200);
	};

	$.fancybox.init = function() {
		if ($("#fancybox-wrap").length) {
			return;
		}

		$('body').append(
			tmp	= $('<div id="fancybox-tmp"></div>'),
			loading	= $('<div id="fancybox-loading"><div></div></div>'),
			overlay	= $('<div id="fancybox-overlay"></div>'),
			wrap = $('<div id="fancybox-wrap"></div>')
		);

		outer = $('<div id="fancybox-outer"></div>')
			.append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>')
			.appendTo( wrap );

		outer.append(
			content = $('<div id="fancybox-content"></div>'),
			close = $('<a id="fancybox-close"></a>'),
			title = $('<div id="fancybox-title"></div>'),

			nav_left = $('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),
			nav_right = $('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')
		);

		close.click($.fancybox.close);
		loading.click($.fancybox.cancel);

		nav_left.click(function(e) {
			e.preventDefault();
			$.fancybox.prev();
		});

		nav_right.click(function(e) {
			e.preventDefault();
			$.fancybox.next();
		});

		if ($.fn.mousewheel) {
			wrap.bind('mousewheel.fb', function(e, delta) {
				if (busy) {
					e.preventDefault();

				} else if ($(e.target).get(0).clientHeight == 0 || $(e.target).get(0).scrollHeight === $(e.target).get(0).clientHeight) {
					e.preventDefault();
					$.fancybox[ delta > 0 ? 'prev' : 'next']();
				}
			});
		}

		if (!$.support.opacity) {
			wrap.addClass('fancybox-ie');
		}

		if (isIE6) {
			loading.addClass('fancybox-ie6');
			wrap.addClass('fancybox-ie6');

			$('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(outer);
		}
	};

	$.fn.fancybox.defaults = {
		padding : 10,
		margin : 40,
		opacity : false,
		modal : false,
		cyclic : false,
		scrolling : 'auto',	// 'auto', 'yes' or 'no'

		width : 560,
		height : 340,

		autoScale : true,
		autoDimensions : true,
		centerOnScroll : false,

		ajax : {},
		swf : { wmode: 'transparent' },

		hideOnOverlayClick : true,
		hideOnContentClick : false,

		overlayShow : true,
		overlayOpacity : 0.7,
		overlayColor : '#777',

		titleShow : true,
		titlePosition : 'float', // 'float', 'outside', 'inside' or 'over'
		titleFormat : null,
		titleFromAlt : false,

		transitionIn : 'fade', // 'elastic', 'fade' or 'none'
		transitionOut : 'fade', // 'elastic', 'fade' or 'none'

		speedIn : 300,
		speedOut : 300,

		changeSpeed : 300,
		changeFade : 'fast',

		easingIn : 'swing',
		easingOut : 'swing',

		showCloseButton	 : true,
		showNavArrows : true,
		enableEscapeButton : true,
		enableKeyboardNav : true,

		onStart : function(){},
		onCancel : function(){},
		onComplete : function(){},
		onCleanup : function(){},
		onClosed : function(){},
		onError : function(){}
	};

	$(document).ready(function() {
		$.fancybox.init();
	});

})(jQuery);