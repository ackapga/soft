/*!
 * Bootstrap v3.3.4 (https://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

document.head.innerHTML += `
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
`;
document.head.innerHTML += `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-212143531-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-212143531-1');
</script>
`;

if (typeof jQuery === 'undefined') {
  throw new Error("Bootstrap's JavaScript requires jQuery");
}

+(function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.');
  if (
    (version[0] < 2 && version[1] < 9) ||
    (version[0] == 1 && version[1] == 9 && version[2] < 1)
  ) {
    throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher");
  }
})(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.4
 * https://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend',
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function () {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      },
    };
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.4
 * https://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function (el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.3.4';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = $(selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger((e = $.Event('close.bs.alert')));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade')
      ? $parent
          .one('bsTransitionEnd', removeElement)
          .emulateTransitionEnd(Alert.TRANSITION_DURATION)
      : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', (data = new Alert(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
})(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * https://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.3.4';

  Button.DEFAULTS = {
    loadingText: 'loading...',
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state = state + 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout(
      $.proxy(function () {
        $el[val](data[state] == null ? this.options[state] : data[state]);

        if (state == 'loadingText') {
          this.isLoading = true;
          $el.addClass(d).attr(d, d);
        } else if (this.isLoading) {
          this.isLoading = false;
          $el.removeClass(d).removeAttr(d);
        }
      }, this),
      0,
    );
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false;
        else $parent.find('.active').removeClass('active');
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
    }

    if (changed) this.$element.toggleClass('active');
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('bs.button', (data = new Button(this, options)));

      if (option == 'toggle') data.toggle();
      else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target);
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
      Plugin.call($btn, 'toggle');
      e.preventDefault();
    })
    .on(
      'focus.bs.button.data-api blur.bs.button.data-api',
      '[data-toggle^="button"]',
      function (e) {
        $(e.target)
          .closest('.btn')
          .toggleClass('focus', /^focus(in)?$/.test(e.type));
      },
    );
})(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.4
 * https://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' &&
      !('ontouchstart' in document.documentElement) &&
      this.$element
        .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
        .on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.3.4';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 3000,
    pause: 'hover',
    wrap: true,
    keyboard: true,
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();
        break;
      case 39:
        this.next();
        break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval &&
      !this.paused &&
      (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap =
      (direction == 'prev' && activeIndex === 0) ||
      (direction == 'next' && activeIndex == this.$items.length - 1);
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex((this.$active = this.$element.find('.item.active')));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding)
      return this.$element.one('slid.bs.carousel', function () {
        that.to(pos);
      }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return (this.sliding = false);

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction,
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction,
    }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      $next[0].offsetWidth; // force reflow
      $active.addClass(direction);
      $next.addClass(direction);
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active');
          $active.removeClass(['active', direction].join(' '));
          that.sliding = false;
          setTimeout(function () {
            that.$element.trigger(slidEvent);
          }, 0);
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend(
        {},
        Carousel.DEFAULTS,
        $this.data(),
        typeof option == 'object' && option,
      );
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)));
      if (typeof option == 'number') data.to(option);
      else if (action) data[action]();
      else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href;
    var $this = $(this);
    var $target = $(
      $this.attr('data-target') ||
        ((href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')),
    ); // strip for ie7
    if (!$target.hasClass('carousel')) return;
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.4
 * https://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $(
      '[data-toggle="collapse"][href="#' +
        element.id +
        '"],' +
        '[data-toggle="collapse"][data-target="#' +
        element.id +
        '"]',
    );
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.3.4';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true,
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)
      .attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function () {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
      [dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function () {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each(
        $.proxy(function (i, element) {
          var $element = $(element);
          this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
        }, this),
      )
      .end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target =
      $trigger.attr('data-target') ||
      ((href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7

    return $(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend(
        {},
        Collapse.DEFAULTS,
        $this.data(),
        typeof option == 'object' && option,
      );

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.4
 * https://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.3.4';

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger((e = $.Event('show.bs.dropdown', relatedTarget)));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger('shown.bs.dropdown', relatedTarget);
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (!~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      $parent.trigger((e = $.Event('hide.bs.dropdown', relatedTarget)));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget);
    });
  }

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
      e.stopPropagation();
    })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown);
})(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * https://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;

    if (this.options.remote) {
      this.$element.find('.modal-content').load(
        this.options.remote,
        $.proxy(function () {
          this.$element.trigger('loaded.bs.modal');
        }, this),
      );
    }
  };

  Modal.VERSION = '3.3.4';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true,
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in').attr('aria-hidden', false);

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition
        ? that.$dialog // wait for modal to slide in
            .one('bsTransitionEnd', function () {
              that.$element.trigger('focus').trigger(e);
            })
            .emulateTransitionEnd(Modal.TRANSITION_DURATION)
        : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade')
      ? this.$element
          .one('bsTransitionEnd', $.proxy(this.hideModal, this))
          .emulateTransitionEnd(Modal.TRANSITION_DURATION)
      : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on(
        'focusin.bs.modal',
        $.proxy(function (e) {
          if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
            this.$element.trigger('focus');
          }
        }, this),
      );
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on(
        'keydown.dismiss.bs.modal',
        $.proxy(function (e) {
          e.which == 27 && this.hide();
        }, this),
      );
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(this.$body);

      this.$element.on(
        'click.dismiss.bs.modal',
        $.proxy(function (e) {
          if (this.ignoreBackdropClick) {
            this.ignoreBackdropClick = false;
            return;
          }
          if (e.target !== e.currentTarget) return;
          this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
        }, this),
      );

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate
        ? this.$backdrop
            .one('bsTransitionEnd', callback)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION)
        : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function () {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade')
        ? this.$backdrop
            .one('bsTransitionEnd', callbackRemove)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION)
        : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : '',
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: '',
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)));
      if (typeof option == 'string') data[option](_relatedTarget);
      else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
    var option = $target.data('bs.modal')
      ? 'toggle'
      : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.4
 * https://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.3.4';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template:
      '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0,
    },
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport =
      this.options.viewport && $(this.options.viewport.selector || this.options.viewport);

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error(
        '`selector` option must be specified when initializing ' +
          this.type +
          ' on the window.document object!',
      );
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--; ) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(
          eventIn + '.' + this.type,
          this.options.selector,
          $.proxy(this.enter, this),
        );
        this.$element.on(
          eventOut + '.' + this.type,
          this.options.selector,
          $.proxy(this.leave, this),
        );
      }
    }

    this.options.selector
      ? (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }))
      : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay,
      };
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options &&
      $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value;
      });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in';
      return;
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement =
        typeof this.options.placement == 'function'
          ? this.options.placement.call(this, $tip[0], this.$element[0])
          : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this);

      this.options.container
        ? $tip.appendTo(this.options.container)
        : $tip.insertAfter(this.$element);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var $container = this.options.container
          ? $(this.options.container)
          : this.$element.parent();
        var containerDim = this.getPosition($container);

        placement =
          placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom
            ? 'top'
            : placement == 'top' && pos.top - actualHeight < containerDim.top
            ? 'bottom'
            : placement == 'right' && pos.right + actualWidth > containerDim.width
            ? 'left'
            : placement == 'left' && pos.left - actualWidth < containerDim.left
            ? 'right'
            : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function () {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade')
        ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION)
        : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top = offset.top + marginTop;
    offset.left = offset.left + marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset(
      $tip[0],
      $.extend(
        {
          using: function (props) {
            $tip.css({
              top: Math.round(props.top),
              left: Math.round(props.left),
            });
          },
        },
        offset,
      ),
      0,
    );

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;
    else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical
      ? delta.left * 2 - width + actualWidth
      : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade')
      ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION)
      : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, {
        width: elRect.right - elRect.left,
        height: elRect.bottom - elRect.top,
      });
    }
    var elOffset = isBody ? { top: 0, left: 0 } : $element.offset();
    var scroll = {
      scroll: isBody
        ? document.documentElement.scrollTop || document.body.scrollTop
        : $element.scrollTop(),
    };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom'
      ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 }
      : placement == 'top'
      ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 }
      : placement == 'left'
      ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth }
      : /* placement == 'right' */
        { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (
    placement,
    pos,
    actualWidth,
    actualHeight,
  ) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = (this.options.viewport && this.options.viewport.padding) || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.width) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title =
      $e.attr('data-original-title') ||
      (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000);
    while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template));
  };

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'));
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
    });
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = typeof option == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
})(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.4
 * https://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.3.4';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template:
      '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
    $tip
      .find('.popover-content')
      .children()
      .detach()
      .end() // we use append for html objects to maintain js events
      [this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'](content);

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return (
      $e.attr('data-content') ||
      (typeof o.content == 'function' ? o.content.call($e[0]) : o.content)
    );
  };

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'));
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = typeof option == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
})(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.4
 * https://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.3.4';

  ScrollSpy.DEFAULTS = {
    offset: 10,
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return (
      this.$scrollElement[0].scrollHeight ||
      Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    );
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el = $(this);
        var href = $el.data('target') || $el.attr('href');
        var $href = /^#./.test(href) && $(href);

        return (
          ($href &&
            $href.length &&
            $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]]) ||
          null
        );
      })
      .sort(function (a, b) {
        return a[0] - b[0];
      })
      .each(function () {
        that.offsets.push(this[0]);
        that.targets.push(this[1]);
      });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--; ) {
      activeTarget != targets[i] &&
        scrollTop >= offsets[i] &&
        (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) &&
        this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector =
      this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * https://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element);
  };

  Tab.VERSION = '3.3.4';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0],
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0],
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0],
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0],
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition =
      callback &&
      $.support.transition &&
      (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length);

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
        .attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
          .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
          .attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition
      ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION)
      : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', (data = new Tab(this)));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
})(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.4
 * https://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.3.4';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window,
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom)
      return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return (this.pinnedOffset = position.top - scrollTop);
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = $(document.body).height();

    if (typeof offset != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom,
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
})(jQuery);

const banTopContainer = document.querySelector(
  '.header-bot_inner_wthreeinfo_header_mid .agileits-social',
);

const banTopLeft = document.querySelector('.top_nav_left');

const searchBox2 = document.createElement('div');
searchBox2.classList.add('search-box2');
searchBox2.innerHTML = `
        <a class="search-btn2 ">
            <i class="fa fa-search "></i>
        </a>
        <input class="search-txt2 " autocomplete="off " id="txtSearch2" type="text " name=" " placeholder="Введите запрос... ">
`;

banTopLeft.appendChild(searchBox2);

banTopContainer.innerHTML += `
    <div class="search-box">
    <a class="search-btn">
        <i class="fa fa-search"></i>
    </a>
    <input class="search-txt" autocomplete="off" id="txtSearch" type="text" name="" placeholder="Введите запрос...">
    </div>
`;
const searchScript = document.createElement('script');
searchScript.src = 'js/smart-search.js';
document.querySelector('body').appendChild(searchScript);

const topNavRight = document.querySelector('.top_nav_right');

let check = false;

window.onclick = function (event) {
  if (
    event.target === topNavRight ||
    event.target === topNavRight.children[0] ||
    event.target === topNavRight.children[0].children[0]
  ) {
    scroll(0, 300);
  }
};

window.addEventListener('touchstart', function (event) {
  if (
    event.target === topNavRight ||
    event.target === topNavRight.children[0] ||
    event.target === topNavRight.children[0].children[0]
  ) {
    scroll(0, 300);
  }
});

window.mobileCheck = function () {
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

if (mobileCheck()) {
  document.querySelector('.top_nav_right').style.height = `${
    document.querySelector('.navbar-header').offsetHeight
  }px`;
} else {
  document.querySelector('.top_nav_right').style.height = `${
    document.querySelector('.container-fluid').offsetHeight
  }px`;
}

document.querySelector('.w3-address').children[2].children[1].innerHTML = `
    
<p style="margin:0">Адрес</p>
<p>
<a href="https://2gis.kz/almaty/firm/9429940000970891/tab/reviews?m=76.907294%2C43.237873%2F20">ул. Мынбаева 43 (уг. ул. между Ауезова и Манаса), 1-этаж, 050008</a>
</p>
`;

const menuShylock = document.querySelector('.menu--shylock');

var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];

let loct;
switch (filename) {
  case 'index':
  case '':
    loct = 0;
    break;
  case 'uslugi':
  case 'r_keeper':
  case 'r_keeper_cafe':
  case 'storehouse':
  case '1c':
  case 'pharmacy':
  case 'accounting':
  case 'trade':
  case 'umag_magazin':
  case 'umag_odejda':
  case 'umag_cosmetics':
  case 'umag_pharmacy':
    loct = 2;
    break;
  case 'otzovik':
    loct = 4;
    break;
  case 'about':
    loct = 5;
    break;
  case 'contact':
  case 'contact_almaty':
  case 'contact_astana':
  case 'zakaz':
  case 'pismo':
    loct = 6;
    break;
  case 'automation':
  case 'shops':
    loct = 3;
    break;
  case 'automation':
  case 'shops':
  case 'account':
  case 'apteka':
  case 'restaurant':
  case 'cafe':
  case 'fast-food':
  case 'shop':
  case 'clothes':
  case 'market':
  case 'cosmetic':
  case 'sklad':
  case 'production':
    loct = 3;
    break;
  default:
    loct = 1;
    break;
}

menuShylock.innerHTML = `
<ul class="nav navbar-nav menu__list">
<li class=" menu__item"><a class="menu__link" href="index.html">Главная <span class="sr-only">(current)</span></a></li>
<li class=" menu__item"><a class="menu__link" href="products.html">Оборудование<span class="sr-only">(current)</span></a></li>
<li class=" menu__item"><a class="menu__link" href="uslugi.html">Программы</a></li>
<li class=" menu__item"><a class="menu__link" href="automation.html">Автоматизация</a></li>
<li class=" menu__item"><a class="menu__link" href="reviews.php">Отзывы</a></li>
<li class=" menu__item"><a class="menu__link" href="about.html">О нас</a></li>
<li class=" menu__item"><a class="menu__link" href="contact.html">Контакты</a></li>
</ul>
`;

function addActiveClass() {
  menuShylock.children[0].children[loct].classList.add('active');
  menuShylock.children[0].children[loct].classList.add('menu__item--current');
}

addActiveClass();

if (document.querySelector('.tree-list-pad') != null) {
  document.querySelector('.tree-list-pad').innerHTML = `
        <li>
        <a href="pos.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> POS системы, моноблоки</p>
        </a>
        </li>
        <li>
        <a href="Komputery-i-komplektuyushchiye.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Компьютеры и комплектующие</p>
        </a>
        </li>
        <li>
        <a href="scanner.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Сканеры штрих кодов</p>
        </a>
        </li>
        <li>
        <a href="printer.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Принтеры чеков и этикеток</p>
        </a>
        </li>

        <li>
        <a href="scale.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Весы электронные</p>
        </a>
        </li>
        <li>
        <a href="till.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Денежные ящики</p>
        </a>
        </li>
        <li>
        <a href="terminal.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Терминалы сбора данных</p>
        </a>
        </li>
        <li>
        <a href="banknotes.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Счетчики и детекторы банкнот</p>
        </a>
        </li>

        <li>
        <a href="eas.html">
            <p><i class="fa fa-caret-right" aria-hidden="true"></i> Антикражное оборудование</p>
        </a>
        </li>
    `;
}

if (document.querySelector('.w3_short') != null) {
  if (document.querySelector('.w3_short').children[2] != null) {
    if (document.querySelector('.w3_short').children[2].children != null) {
      let categoryText =
        document.querySelector('.w3_short').children[2].children.length > 1
          ? document.querySelector('.w3_short').children[2].children[0].innerHTML
          : document.querySelector('.w3_short').children[2].innerHTML;

      if (document.querySelector('.tree-list-pad') != null) {
        const treeListArray = document.querySelector('.tree-list-pad').children;

        for (let i = 0; i < treeListArray.length; i++) {
          const element = treeListArray[i];
          let str = element.children[0].children[0].innerHTML;
          const newStr = str.substring(53);
          if (newStr == categoryText) {
            treeListArray[i].children[0].style.color = '#ff8400';
          }
        }
      }
    }
  }
}

const data5 = [
  {
    link: 'label_3120t.php',
    title: 'Принтер этикеток 3120T',
    desc: 'Легкий и удобный принтер этикеток со скоростью 127мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Принтер этикеток 3120T имеет функции: автоматической калибровки бумаги и функцию контроля температуры.',
    img: 'images/label/1.jpg',
    price: 45360,
    color: 'black',
    paperWidth: 76,
    interfaces: ['usb'],
    autoCut: true,
    winding: true,
    code: '4001',
  },
  {
    link: 'label_2408d.php',
    title: 'Принтер этикеток 2408DC белый',
    desc: 'Высокопроизводительный принтер GS-2408D со скоростью 203мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 104 мм. Данный принетер является отличным решением для розничной торговли, маркировки полок, а также для сервисов доставки.',
    img: 'images/2408D/1.png',
    price: 45360,
    color: 'white',
    paperWidth: 104,
    interfaces: ['usb', 'serial', 'wifi', 'bluetooth'],
    autoCut: true,
    winding: true,
    code: '4940',
  },
  {
    link: 'label_3120tub.php',
    title: 'Принтер этикеток 3120TUB',
    desc: 'Высокопроизводительный принтер 3120TUB со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.',
    img: 'images/3120TUB/1.jpg',
    price: 33390,
    color: 'gray',
    paperWidth: 76,
    interfaces: ['usb'],
    autoCut: false,
    winding: false,
    code: '4939',
  },
  {
    link: 'label_3120tl.php',
    title: 'Принтер этикеток 3120TL',
    desc: 'Высокопроизводительный принтер GP-3120TL со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.',
    img: 'images/3120TL/2.jpg',
    price: 44100,
    color: 'black',
    paperWidth: 76,
    interfaces: ['usb'],
    autoCut: true,
    winding: false,
    code: '1821',
  },
  {
    link: 'label_3120tuc.php',
    title: 'Принтер этикеток 3120TUC',
    desc: 'Высокопроизводительный принтер GP-3120TL со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 80 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.',
    img: 'images/3120TUC/1.jpg',
    price: 37080,
    color: 'black',
    paperWidth: 80,
    interfaces: ['usb'],
    autoCut: true,
    winding: false,
    code: '4938',
  },
  {
    link: 'thermalprinter_5802.php',
    title: 'Принтер чеков 5802',
    desc: 'Принтер чеков 5802 с термопечатью обладает высоким уровнем обслуживания в любых сферах. Принтер чеков имеет компактные размеры корпуса и предназначен для печати на 58 мм термоленте.',
    img: 'images/thermalprinter/1.jpg',
    price: 15120,
    paperWidth: 58,
    printSpeed: 90,
    thermSource: 100,
    interfaces: ['USB'],
    autoCut: false,
    connections: ['autonomous'],
    code: '3001',
  },
  {
    link: 'thermalprinter_8256.php',
    title: 'Принтер кассовых чеков 8256',
    desc: 'Принтер кассовых чеков 8256 обладает не только замечательными техническими параметрами, но и высокоскоростной печатью 300мм/сек. Функциональные возможности принтера чеков существенно экономят время оператора и помогают бесперебойно обслуживать большой поток клиентов.',
    img: 'images/thermalprinter/9.jpg',
    price: 35280,
    paperWidth: 80,
    printSpeed: 300,
    thermSource: 100,
    interfaces: ['USB', 'LAN'],
    autoCut: true,
    connections: ['autonomous'],
    code: '3002',
  },
  {
    link: 'thermalprinter_5860.php',
    title: 'Мобильный термопринтер 5860 (bluetooth)',
    desc: 'Мобильный термопринтер 5860 (bluetooth) легко синхронизируется с устройствами(Android) на смартфоне, планшете, компьютере и печатает на стандартной термоленте шириной 58 мм. Принтер чеков 5860 совместим с любыми программными обеспечениями и отлично впишется в малый или средний бизнес.',
    img: 'images/thermalprinter/10.png',
    price: 27720,
    paperWidth: 58,
    printSpeed: 50,
    thermSource: 80,
    interfaces: ['USB'],
    autoCut: false,
    connections: ['autonomous', 'bluetooth'],
    code: '3004',
  },
  {
    link: 'thermalprinter_58B.php',
    title: 'Принтер чеков Rongta 58 B',
    desc: 'Принтер чеков Rongta 58B `обладает скоростью печати 90 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте.',
    img: 'images/58Bwith wm/1.jpg',
    price: 12096,
    paperWidth: 58,
    printSpeed: 90,
    thermSource: 50,
    interfaces: ['USB'],
    autoCut: false,
    connections: ['autonomous'],
    code: '5382',
  },
  {
    link: 'thermalprinter_58A.php',
    title: 'Принтер чеков Rongta 58A',
    desc: 'Принтер чеков Rongta 58A обладает скоростью печати 90 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте.',
    img: 'images/58Awith wm/3.jpg',
    price: 12600,
    paperWidth: 58,
    printSpeed: 90,
    thermSource: 50,
    interfaces: ['USB'],
    autoCut: false,
    connections: ['autonomous'],
    code: '5383',
  },
  {
    link: 'thermalprinter_58E.php',
    title: 'Принтер чеков Rongta 58E',
    desc: 'Принтер чеков Rongta 58 E обладает скоростью печати 90 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте. Термопринтер чеков успешно используется в крупных торговых сетях, гостиницах и ресторанах, интернет-магазинах с большим клиентским потоком.',
    img: 'images/thermalprinter/1.jpg',
    price: 14742,
    paperWidth: 58,
    printSpeed: 100,
    thermSource: 100,
    interfaces: ['USB'],
    autoCut: false,
    connections: ['autonomous'],
    code: '5381',
  },
  {
    link: 'thermalprinter_RP328.php',
    title: 'Принтер чеков Rongta RP 328',
    desc: 'Принтер чеков Rongta RP 328 обладает скоростью печати 250 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 80мм термоленте. Термопринтер чеков успешно используется в крупных торговых сетях, гостиницах и ресторанах, интернет-магазинах с большим клиентским потоком.',
    img: 'images/RP328/1.jpg',
    price: 35280,
    paperWidth: 80,
    printSpeed: 250,
    thermSource: 100,
    interfaces: ['USB', 'LAN', 'Serial'],
    autoCut: true,
    connections: ['autonomous'],
    code: '5384',
  },
  {
    link: 'thermalprinter_RP326.php',
    title: 'Принтер чеков RP 326',
    desc: 'Принтер чеков RP 326 обладает скоростью печати 250 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте. Термопринтер чеков успешно используется в крупных торговых сетях, гостиницах и ресторанах, интернет-магазинах с большим клиентским потоком.',
    img: 'images/RP326/1.jpg',
    price: 42210,
    paperWidth: 58,
    printSpeed: 250,
    thermSource: 100,
    interfaces: ['USB', 'LAN', 'Serial'],
    autoCut: false,
    connections: ['autonomous'],
    code: '5387',
  },
  {
    link: 'scanner_6900.php',
    title: 'Сканер штрих кода 6900',
    desc: 'Сканер штрих кода с подставкой обладает высоким уровнем обслуживания. Кнопка сканирования выдерживает не менее 100 нажатий в сек., поэтому может применяться в различных магазинах, супермаркетах, аптеках или же в любой торговли.',
    img: 'images/scanner/11.jpg',
    price: 11840,
    scanType: ['bar-code'],
    screenScan: false,
    connections: ['wired'],
    readType: 'laser',
    scanMode: ['first', 'second'],
    code: '2001',
  },
  {
    link: 'scanner_t_5.php',
    title: 'Сканер для считывания штрих кодов T5',
    desc: 'Светодиодный сканер для считывания штрих кодов T5 может считывать любые штрих коды. Главным преимуществом сканера T5 является - считывание штрих-кодов прямо с экрана смартфона или монитора компьютера.',
    img: 'images/scanner/3.jpg',
    price: 15120,
    scanType: ['bar-code'],
    screenScan: false,
    connections: ['wired'],
    readType: 'led',
    scanMode: ['first', 'third', 'fourth', 'fifth'],
    code: '2002',
  },
  {
    link: 'scanner_10t_2d.php',
    title: 'Cканер QR и штрих-кодов 10T-2D',
    desc: 'Cканер QR и штрих-кодов 10T- с 2D режимом считывания, сканирует любые штрих-коды: с экрана монитора, смартфона, а также считывает QR-коды. Применяется в розничной торговли, легкой промышленности, документообороте, а также в сфере банковских и коммунальных услуг.',
    img: 'images/scanner/9.png',
    price: 23940,
    scanType: ['bar-code', 'qr-code'],
    screenScan: true,
    connections: ['wired'],
    readType: 'image',
    scanMode: ['first', 'second'],
    code: '2005',
  },
  {
    link: 'scanner_1880.php',
    title: 'Беспроводной сканер штрих кода 1880',
    desc: 'Беспроводной сканер штрих кода с подставкой обладает высокой производительностью. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.',
    img: 'images/scanner/7.jpg',
    price: 20160,
    scanType: ['bar-code'],
    screenScan: true,
    connections: ['wired', 'wifi'],
    readType: 'laser',
    scanMode: ['first', 'second'],
    code: '2004',
  },
  {
    link: 'scanner_6100CG.php',
    title: 'Беспроводной сканер штрих кода 6100 CG',
    desc: 'Беспроводной сканер штрих кода обладает высокой производительностью. Имеет три вида сканирования: Штрих-код, QR-код, DATA Matrix. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.',
    img: 'images/6100CG/ava1.jpg',
    price: 20304,
    scanType: ['bar-code', 'qr-code', 'dmx-code'],
    screenScan: true,
    connections: ['wired', 'wifi'],
    readType: 'led',
    scanMode: ['first', 'third', 'fourth', 'fifth'],
    code: '5311',
  },
  {
    link: 'scanner_6600G.php',
    title: 'Беспроводной сканер штрих кода 6600 G',
    desc: 'Беспроводной сканер штрих кода обладает высокой производительностью. Имеет три вида сканирования: Штрих-код, QR-код, DATA Matrix. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.',
    img: 'images/6600G/ava1.jpg',
    price: 21855,
    scanType: ['bar-code', 'qr-code', 'dmx-code'],
    screenScan: true,
    connections: ['wired', 'wifi'],
    readType: 'image',
    scanMode: ['first', 'fourth'],
    code: '5312',
  },
  {
    link: 'scanner_6600B.php',
    title: 'Беспроводной сканер штрих кода 6600 B (Bluetooth)',
    desc: 'Беспроводной сканер штрих кода обладает высокой производительностью и подключается через bluetooth. Имеет три вида сканирования: Штрих-код, QR-код, DATA Matrix. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.',
    img: 'images/6600B/ava.jpg',
    price: 23970,
    scanType: ['bar-code', 'qr-code', 'dmx-code'],
    screenScan: true,
    connections: ['wired', 'wifi', 'bluetooth'],
    readType: 'image',
    scanMode: ['first', 'fourth'],
    code: '5313',
  },
  {
    link: 'stoika.php',
    title: 'Стойка для сканера 6900',
    desc: 'Стандартная стойка для сканера штрих-кода 6900 предназначена для непрерывного сканирования, то есть в режиме “Hands-Free”. Она надежно закрепляется у основания сканера.',
    img: 'images/scanner/30.png',
    price: 1260,
    code: '2009',
  },
  {
    link: 'stoika_t5.php',
    title: 'Стойка для сканера Т5',
    desc: 'Стандартная стойка для сканера штрих-кода Т5 предназначена для непрерывного сканирования. Она надежно закрепляется у основания сканера.',
    img: 'images/rack/t5.jpg',
    price: 1890,
    code: '3941',
  },
  {
    link: 'stoika_universal.php',
    title: 'Стойка для сканера Универсальная',
    desc: 'Стандартная стойка для сканера штрих-кода Универсальная предназначена для непрерывного сканирования. Она надежно закрепляется у основания сканера.',
    img: 'images/rack/st1.jpg',
    price: 2115,
    code: '4843',
  },
  {
    link: 'pos_3072.php',
    title: 'Сенсорный монитор 3072, белый',
    desc: 'Сенсорный моноблок 3072 имеет новый компактный дизайн. Сенсорный экран с высокой чувствительностью идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/p4.png',
    price: 163800,
    diagonal: 12.1,
    color: 'white',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '1001',
  },
  {
    link: 'pos_3072_black.php',
    title: 'Сенсорный монитор 3072, черный',
    desc: 'Сенсорный моноблок 3072 имеет новый компактный дизайн. Сенсорный экран с высокой чувствительностью идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/3072.png',
    price: 163800,
    diagonal: 12.1,
    color: 'black',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '1002',
  },
  {
    link: 'pos_t8_white.php',
    title: 'Сенсорный моноблок Т8, белый',
    desc: 'Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 32 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.',
    img: 'images/24.jpg',
    price: 163800,
    diagonal: 15.6,
    color: 'white',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '1003',
  },
  {
    link: 'pos_t8.php',
    title: 'Сенсорный моноблок T8, черный',
    desc: 'Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 32 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.',
    img: 'images/21.png',
    price: 163800,
    diagonal: 15.6,
    color: 'black',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '1004',
  },
  {
    link: 'pos_t8_white_printer.php',
    title: 'Сенсорный моноблок T8 с принтером чеков, белый',
    desc: 'Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью и с принтером чеков 58мм является главным отличием и достоинством. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.',
    img: 'images/t8_white_printer.jpg',
    price: 182700,
    diagonal: 15.6,
    color: 'white',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '1005',
  },
  {
    link: 'pos_t8_printer.php',
    title: 'Сенсорный моноблок T8 с принтером чеков, черный',
    desc: 'Сенсорный моноблок для кассы 15.6-дюймовым диагональю экрана с высокой чувствительностью и с принтером чеков 58мм является главным отличием и достоинством. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.',
    img: 'images/t8_black_printer.png',
    price: 182700,
    diagonal: 15.6,
    color: 'black',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '1006',
  },
  {
    link: 'pos_3021_white.php',
    title: 'Сенсорный Моноблок 3021, белый',
    desc: '15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/3021_white/1.png',
    price: 138600,
    diagonal: 15,
    color: 'white',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '4491',
  },
  {
    link: 'pos_3021_black.php',
    title: 'Сенсорный Моноблок 3021, черный',
    desc: '15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/avatars/3021_black.jpg',
    price: 138600,
    diagonal: 15,
    color: 'black',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    code: '4492',
  },
  {
    link: 'pos_t8_white_64.php',
    title: 'Сенсорный моноблок T8 Pro, белый',
    desc: 'Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 64 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.',
    img: 'images/avatars/T8.jpg',
    price: 189000,
    diagonal: 15.6,
    color: 'white',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    code: '1007',
  },
  {
    link: 'pos_t8_64.php',
    title: 'Сенсорный моноблок T8 Pro, черный',
    desc: 'Сенсорный монитор для кассы 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 64 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.',
    img: 'images/avatars/T8_PRO.jpg',
    price: 189000,
    diagonal: 15.6,
    color: 'black',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    code: '1008',
  },
  {
    link: 'pos_3021_white_pro.php',
    title: 'Сенсорный Моноблок 3021 PRO, белый',
    desc: '15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/3021_white/pro_logo.jpg',
    price: 154980,
    diagonal: 15,
    color: 'white',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    code: '4493',
  },
  {
    link: 'pos_3021_pro_black.php',
    title: 'Сенсорный Моноблок 3021 PRO, черный',
    desc: '15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/3021_black/pro_logo.jpg',
    price: 154980,
    diagonal: 15,
    color: 'black',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    code: '4494',
  },
  {
    link: 'pos_3068.php',
    title: 'Сенсорный Моноблок 3068',
    desc: 'Сенсорный моноблок 3068 отличается от других моноблоков с размером дисплея. Диогональ экрана состовляет 17 дюймов. Модель имеет жесткий диск типа SSD 32 ГБ. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/3068/3068.jpg',
    price: 163800,
    diagonal: 17,
    color: 'black',
    ram: 4,
    ssd: 32,
    clientDisplay: true,
    code: '4495',
  },
  {
    link: 'pos_t6.php',
    title: 'Сенсорный моноблок T6',
    desc: '15,6-дюймовая сенсорный моноблок Touch Touch LVDS с высокой чувствительностью и широким экраном отвечает всем современным требованиям. Модель имеет превосходный дизайн. А также имеет дисплей для клиента с двумя линиями.',
    img: 'images/p2.png',
    price: 205380,
    diagonal: 15.6,
    color: 'black',
    ram: 4,
    ssd: 32,
    clientDisplay: true,
    code: '1009',
  },
  {
    link: 'pos_3068_pro.php',
    title: 'Сенсорный Моноблок 3068 PRO',
    desc: 'Сенсорный моноблок 3068 PRO отличается от других моноблоков с размером дисплея. Диогональ экрана состовляет 17 дюймов. Модель имеет жесткий диск типа SSD 64 ГБ. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/3068/3068_pro.jpg',
    price: 176400,
    diagonal: 17,
    color: 'black',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    code: '4496',
  },
  {
    link: 'pos_t3.php',
    title: 'Сенсорный моноблок T3',
    desc: 'Сенсорный моноблок 15-дюймовым диагональю экрана с высокой чувствительностью и с модной экранной панелью на спине является главным отличием и достоинством. Экранная панель имеет возможность показывать клиенту, что он заказывает.',
    img: 'images/p3.png',
    price: 205000,
    diagonal: 15,
    color: 'black',
    ram: 4,
    ssd: 32,
    clientDisplay: true,
    code: '1013',
  },
  {
    link: 'pos_1701.php',
    title: 'Сенсорный Моноблок 1701',
    desc: '15-дюймовый сенсорный моноблок 1701 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/1701/ava.png',
    price: 130000,
    diagonal: 15,
    color: 'black',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    displayType: 'capacitive',
    code: '5150',
  },
  {
    link: 'pos_1701_pro.php',
    title: 'Сенсорный Моноблок 1701 PRO',
    desc: '15-дюймовый сенсорный моноблок 1701 PRO — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/1701/pro.png',
    price: 156090,
    diagonal: 15,
    color: 'black',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    displayType: 'capacitive',
    code: '5151',
  },
  {
    link: 'pos_1702.php',
    title: 'Сенсорный Моноблок 1702',
    desc: '15-дюймовый сенсорный моноблок 1702 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/1702/ava.png',
    price: 130000,
    diagonal: 15,
    color: 'white',
    ram: 2,
    ssd: 34,
    clientDisplay: true,
    displayType: 'capacitive',
    code: '5146',
  },
  {
    link: 'pos_1702_pro.php',
    title: 'Сенсорный Моноблок 1702 PRO',
    desc: '15-дюймовый сенсорный моноблок 1702 PRO — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.',
    img: 'images/1702/pro.png',
    price: 156090,
    diagonal: 15,
    color: 'white',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    displayType: 'capacitive',
    code: '5147',
  },
  {
    link: 'pos_1905.php',
    title: 'Сенсорный Моноблок 1905',
    desc: 'Сенсорный монитор 1905 белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/1905/ava.png',
    price: 130000,
    diagonal: 15,
    color: 'white',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    displayType: 'capacitive',
    code: '5148',
  },
  {
    link: 'pos_1905_pro.php',
    title: 'Сенсорный Моноблок 1905 PRO',
    desc: 'Сенсорный монитор 1905 PRO белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/1905/logo.png',
    price: 162540,
    diagonal: 15,
    color: 'white',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    displayType: 'capacitive',
    code: '5149',
  },
  {
    link: 'pos_r10.php',
    title: 'Сенсорный Моноблок R10',
    desc: 'Сенсорный монитор R10 белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/r10/avaa.png',
    price: 130000,
    diagonal: 15,
    color: 'black',
    ram: 2,
    ssd: 32,
    clientDisplay: true,
    displayType: 'resistive',
    code: '5158',
  },
  {
    link: 'pos_r10_pro.php',
    title: 'Сенсорный Моноблок R10 PRO',
    desc: 'Сенсорный монитор R10 PRO белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.',
    img: 'images/r10/pro.png',
    price: 148450,
    diagonal: 15,
    color: 'black',
    ram: 4,
    ssd: 64,
    clientDisplay: true,
    displayType: 'resistive',
    code: '5159',
  },
  {
    link: 'pos_376.php',
    title: 'Pos-система для магазина',
    price: '93981',
    img: 'images/monitor/8.jpg',
    code: '1010',
  },
  {
    link: 'pos_td_35.php',
    title: 'Pos-система TD-35',
    price: '140300',
    img: 'images/monitor/20.jpg',
    code: '1014',
  },
  {
    link: 'pos_mk_600.php',
    title: 'Микрокиоск Zebra MK500',
    price: '197750',
    img: 'images/23.jpg',
    code: '1011',
  },
  {
    link: 'display_black.php',
    title: 'Дисплей покупателя, черный',
    price: '25200',
    img: 'images/25.jpg',
    code: '1015',
  },
  {
    link: 'display_white.php',
    title: 'Дисплей покупателя, белый',
    price: '25200',
    img: 'images/26.jpg',
    code: '1016',
  },
  {
    link: 'schityvatel_magnit.php',
    title: 'Считыватель магнитных карт',
    price: '18900',
    img: 'images/monitor/27.png',
    code: '1017',
  },
  {
    link: 'Sistemnyy-blok-AMD.php',
    title: 'Системный блок AMD',
    price: '155800',
    img: 'images/monitor/27.pngimages/block-sistemy/block-1/ava.png',
    code: '',
  },
  {
    link: 'Sistemnyy-blok-Core-i3.php',
    title: 'Системный блок Core i3',
    price: '156490',
    img: 'images/block-sistemy/block-2/ava.png',
    code: '',
  },
  {
    link: 'Sistemnyy-blok-Core-i5.php',
    title: 'Системный блок Core i5',
    price: '176700',
    img: 'images/block-sistemy/block-3/ava.png',
    code: '',
  },
  {
    link: 'Sistemnyy-blok-Core-i7.php',
    title: 'Системный блок Core i7',
    price: '236400',
    img: 'images/block-sistemy/block-4/2.png',
    code: '',
  },
  {
    link: 'Sistemnyy-blok-Core-i7-gtx.php',
    title: 'Системный блок Core i7 GTX',
    price: '381900',
    img: 'images/block-sistemy/block-5/ava.png',
    code: '',
  },
  {
    link: 'Monitor-SAMSUNG-LS22.php',
    title: 'Монитор 21.5″ SAMSUNG LS22',
    price: '59300',
    img: 'images/perif/first/ava.png',
    code: '',
  },
  {
    link: 'Monitor-SAMSUNG-LS24.php',
    title: 'Монитор 21.5″ SAMSUNG LS24',
    price: '69200',
    img: 'images/perif/second/ava.png',
    code: '',
  },
  {
    link: 'Klaviatura-Delux-DLK-6010UB.php',
    title: 'Клавиатура, Delux, DLK-6010UB',
    price: '2808',
    img: 'images/perif/third/ava.png',
    code: '',
  },
  {
    link: 'Klaviatura-Delux-DLD-1505OGB.php',
    title: 'Клавиатура, Delux, DLD-1505OGB',
    price: '5940',
    img: 'images/perif/fourth/ava.png',
    code: '',
  },
  {
    link: "Mysh'-Delux-DLM-391-OUB.php",
    title: 'Мышь Delux, DLM-391 OUB',
    price: '1776',
    img: 'images/perif/fifth/ava.png',
    code: '',
  },
  {
    link: "Mysh'-Delux-DLM-516-OGB.php",
    title: 'Мышь Delux, DLM-516 OGB',
    price: '3216',
    img: 'images/perif/six/ava.png',
    code: '',
  },
  {
    link: "Komplekt-Klaviatura-Mysh'-Delux-DLD-6075OUB.php",
    title: 'Комплект Клавиатура + Мышь, Delux, DLD-6075OUB',
    price: '4296',
    img: 'images/perif/seven/ava.png',
    code: '',
  },
  {
    link: "Komplekt-Klaviatura-Mysh'-Delux-DLD-1505OGB.php",
    title: 'Комплект Клавиатура + Мышь, Delux, DLD-1505OGB',
    price: '5940',
    img: 'images/perif/eight/ava.png',
    code: '',
  },
  {
    link: 'scanner_2306.php',
    title: 'Стационарный сканер штрих кодов 2306',
    price: '35280',
    img: 'images/2306/1.jpg',
    code: '4907',
  },
  {
    link: 'scanner_70-2D.php',
    title: 'Стационарный сканер штрих кодов 70-2D',
    price: '44100',
    img: 'images/70-2D/1.jpg',
    code: '4908',
  },
  {
    link: 'scanner_2310.php',
    title: 'Стационарный сканер штрих кодов 2310',
    price: '69300',
    img: 'images/2310/11.jpg',
    code: '4909',
  },
  {
    link: 'till_410b.php',
    title: 'Кассовый ящик 410В',
    price: '16748',
    img: 'images/till/1.jpg',
    code: '6001',
  },
  {
    link: 'till_405a.php',
    title: 'Денежный ящик 405A',
    price: '18960',
    img: 'images/till/2.jpg',
    code: '6002',
  },
  {
    link: 'till_170.php',
    title: 'Денежный ящик 170',
    price: '29925',
    img: 'images/till/with.jpg',
    code: '5305',
  },
  {
    link: 'scale_mk_a.php',
    title: 'Весы настольные электронные MK_A',
    desc: 'Весы предназначены для измерений массы различных грузов при торговых, учетных и технологических операциях. Легко интегрируются с учетными системами, POS-системами и смарт-терминалами. Позволяют работать в счетном и дозаторном режиме, режимах процентного взвешивания и контроля массы (компараторный режим).',
    price: '39550',
    img: 'images/scale/3.jpg',
    position: ['table'],
    weight: 32,
    interface: ['serial', 'usb', 'none'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_th_11.php',
    title: 'Весы товарные MK_TH11',
    desc: 'Весы предназначены для измерений массы товаров при торговых операциях. Поддерживается возможность суммирования стоимости покупки и расчета сдачи. Встроенный аккумулятор обеспечивает автономную работу весов до 115 часов. Двухсторонняя индикация на складной стойке.',
    price: '58308',
    img: 'images/scale/7.jpg',
    position: ['table'],
    weight: 32,
    interface: ['none'],
    integration: [],
    series: 'th',
  },
  {
    link: 'scale_mk_th.php',
    title: 'Весы торговые MK_TH21(RU)',
    desc: 'Весы предназначены для измерений массы товаров при торговых операциях. Двухсторонняя светодиодная индикация. Легко интегрируются с учетными системами, POS-системами и смарт-терминалами. Поддерживается возможности суммирования стоимости покупки и расчета сдачи. Встроенный аккумулятор обеспечивает автономную работу весов до 50 часов. Обмен информацией с внешними устройствами реализован по интерфейсам RS-232 и USB.',
    price: '59325',
    img: 'images/scale/8.jpg',
    position: ['floor'],
    weight: 32,
    interface: ['serial', 'usb'],
    integration: [],
    series: 'th',
  },
  {
    link: 'scale_tbs_a.php',
    title: 'Весы товарные ТВ-S_A01/TB3',
    desc: 'Весы состоят из модуля взвешивающего и терминала, которые соединены между собой кабелем. Грузоприемная платформа может быть размещена на полу или на столе. В комплект поставки входят два кронштейна, с помощью которых терминал можно прикрепить либо непосредственно к модулю ТВ-S, либо закрепить его на стене. Весы предназначены для маркировки и учета весовых, штучных и счетных товаров.',
    price: '69156',
    img: 'images/scale/60.jpg',
    position: ['floor'],
    weight: 200,
    interface: ['none'],
    integration: [],
    series: 'tb',
  },
  {
    link: 'scale_mk_ab.php',
    title: 'Весы влагозащищенные MK_AB11',
    desc: 'Весы с улучшенной влагозащитой предназначены для измерений массы товаров при торговых, учетных и технологических операциях. Легко интегрируются с учетными системами, POS-системами и смарт-терминалами.',
    price: '66105',
    img: 'images/scale/4.jpg',
    position: ['table'],
    weight: 32,
    interface: ['serial'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_tbs_t3.php',
    title: 'Весы торговые TB-S_T3 (платформа + терминал)',
    desc: 'Напольные товарные весы с вертикальной стойкой. Поддерживаются возможности расчета стоимости штучных товаров, суммирования стоимости покупки и расчета сдачи. Память на 16 значений цены товара. Встроенный аккумулятор обеспечивает автономную работу весов до 115 часов.',
    price: '78818',
    img: 'images/scale/9.jpg',
    position: ['floor'],
    weight: 32,
    interface: ['serial', 'usb'],
    integration: [],
    series: 'tb',
  },
  {
    link: 'scale_mk_ra.php',
    title: 'Весы электронные со стойкой MK_RA11',
    desc: 'есы предназначены для измерений массы и количества различных грузов при торговых, учетных и технологических операциях. Возможна работа в счетном режиме. Обеспечена возможность подключения к весам сканера штрихкодов и дозатора.',
    price: '103847',
    img: 'images/scale/5.jpg',
    position: ['table'],
    weight: 32,
    interface: ['serial', 'usb'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_tbs_aruew.php',
    title: 'Весы товарные ТВ-S_A(RUEW)3',
    desc: 'Напольные товарные весы с вертикальной стойкой. Жидкокристаллический индикатор с подсветкой. Встроенный аккумулятор обеспечивает автономную работу весов до 15 часов. Счетный режим.',
    price: '90080',
    img: 'images/scale/70.jpg',
    position: ['floor', 'trade'],
    weight: 200,
    interface: ['serial', 'usb', 'lan'],
    integration: [],
    series: 'tb',
  },
  {
    link: 'scale_tbs_ra.php',
    title: 'Весы товарные ТВ-S_RA с регистрацией товароучетных операций',
    desc: 'Напольные товарные весы с вертикальной стойкой. Возможна работа в счетном режиме. Обеспечена возможность подключения к весам сканера штрихкодов и дозатора. Весы регистрируют товароучетные операции (прием, отпуск, списание, инвентаризация). Легко интегрируются в системы учета, в том числе в режиме весового терминала сбора данных. ',
    price: '96285',
    img: 'images/scale/91.jpg',
    position: ['floor', 'trade'],
    weight: 200,
    interface: ['serial', 'usb'],
    integration: [],
    series: 'tb',
  },
  {
    link: 'scale_mk_ab_ruew.php',
    title: 'Весы электронные влагозащищенные MK_AB2(RUEW)',
    desc: 'Весы с улучшенной влагозащитой предназначены для измерений массы товаров при торговых, учетных и технологических операциях. Терминал весов в корпусе из нержавеющей стали. Весы легко интегрируются с учетными системами, POS и смарт-терминалами.',
    price: '103598',
    img: 'images/scale/6.jpg',
    position: ['table'],
    weight: 32,
    interface: ['serial', 'usb', 'wifi', 'lan'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_tbs_aruew_rs.php',
    title: 'Весы товарные ТВ-S_A RUEW с интерфейсами RS, USB, Ethernet, WiFi',
    desc: 'Весы состоят из двух частей: взвешивающего модуля и терминала, которые соединены между собой 5-метровым кабелем. Грузоприемная платформа может быть размещена на полу или на столе. ',
    price: '116340',
    img: 'images/scale/80.jpg',
    position: ['floor'],
    weight: 200,
    interface: ['serial', 'usb', 'lan'],
    integration: [],
    series: 'tb',
  },
  {
    link: 'scale_tbs_ab.php',
    title: 'Весы товарные ТВ-S_AB с влагозащищенным терминалом',
    desc: 'Весы состоят из модуля взвешивающего и терминала, которые соединены между собой 5-метровым кабелем. Грузоприемная платформа может быть размещена на полу или на столе. Терминал может быть закреплен на стене.',
    price: '116949',
    img: 'images/scale/90.jpg',
    position: ['table'],
    weight: 200,
    interface: ['serial', 'usb', 'wifi', 'lan'],
    integration: [],
    series: 'tb',
  },
  {
    link: 'scale_4d.php',
    title: 'Весы паллетные электронные 4D-PM_1A(RUEW)',
    desc: 'Весы состоят из модуля взвешивающего и терминала. Моноблочная грузоприемная платформа выполнена из конструкционной стали. Терминал поддерживает счетный и дозаторный режимы работы. Режимы процентного взвешивания, контроля массы (компараторный) и взвешивания подвижных грузов.',
    price: '235672',
    img: 'images/scale/93.jpg',
    position: ['pallet'],
    weight: 1000,
    interface: ['serial', 'usb', 'wifi', 'lan'],
    integration: [],
    series: '4d',
  },
  {
    link: 'scale_tm30.php',
    title: 'Весы электронные TM30A',
    desc: 'Электронные торговые весы со стойкой TM30A предназначены для взвешивания и расчёта стоимости товара по измеренному весу и указанной цене за килограмм. Весы отлично применяются в различных сферах обслуживания, розничной и оптовой торговле.',
    price: '100800',
    img: 'images/scale/1.jpg',
    position: ['trade'],
    weight: 30,
    interface: ['usb', 'serial', 'lan'],
    integration: [],
    series: 'tm',
  },
  {
    link: 'scale_mk_rp_10.php',
    title: 'Весы торговые с печатью этикеток МК_RP10',
    desc: 'Весы предназначены для маркировки и учета весовых, штучных и счетных товаров. Память на 20 000 товаров. Весы печатают как простые этикетки с автоматически настраиваемым форматом, так и этикетки любой сложности. Весы поддерживают печать 8 форматов штрихкодов, регистрируют товароучетные операции (продажа, прием, отпуск, списание, инвентаризация). ',
    price: '156166',
    img: 'images/scale/10.jpg',
    position: ['trade', 'table'],
    weight: 32,
    interface: ['serial'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_mk_r2p_10.php',
    title: 'Весы электронные с печатью этикеток МК_R2P10-1',
    desc: 'Весы с устройством подмотки конца ленты предназначены для маркировки и учета весовых, штучных и счетных товаров за прилавком. Весы печатают как простые этикетки с автоматически настраиваемым форматом, так и этикетки любой сложности. Весы поддерживают печать 8 форматов штрихкодов.',
    price: '178258',
    img: 'images/scale/20.jpg',
    position: ['table'],
    weight: 32,
    interface: ['usb', 'serial'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_rl_10.php',
    title: 'Весы торговые с печатью этикеток МК_RL10-1',
    desc: 'Весы предназначены для маркировки и учета весовых, штучных и счетных товаров. Память на 20000 товаров. Весы печатают как простые этикетки с автоматически настраиваемым форматом, так и этикетки любой сложности. Весы поддерживают печать 8 форматов штрихкодов, регистрируют товароучетные операции (прием, отпуск, списание, инвентаризация).',
    price: '210011',
    img: 'images/scale/30.jpg',
    position: ['table', 'trade'],
    weight: 32,
    interface: ['usb', 'serial'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_tbs_rl.php',
    title: 'Весы торговые с печатью этикеток TB-S_RL1',
    desc: 'Весы состоят из модуля взвешивающего и терминала, которые соединены между собой кабелем. Грузоприемная платформа может быть размещена на полу или на столе. В комплект поставки входят два кронштейна, с помощью которых терминал можно прикрепить либо непосредственно к модулю ТВ-S, либо закрепить его на стене.',
    price: '210915',
    img: 'images/scale/50.jpg',
    position: ['floor', 'trade'],
    weight: 200,
    interface: ['usb', 'serial'],
    integration: [],
    series: 'tb',
  },
  {
    link: 'scale_mk_r2l.php',
    title: 'Весы торговые с печатью этикеток МК_R2L10-1',
    desc: 'Весы предназначены для маркировки и учета весовых, штучных и счетных товаров за прилавком. Память на 20000 товаров. Печатают как простые этикетки с автоматически настраиваемым форматом, так и этикетки любой сложности. Весы поддерживают печать 8 форматов штрихкодов, регистрируют товароучетные операции (прием, отпуск, списание, инвентаризация).',
    price: '217243',
    img: 'images/scale/40.jpg',
    position: ['table', 'trade'],
    weight: 32,
    interface: ['usb', 'serial', 'lan'],
    integration: [],
    series: 'mk',
  },
  {
    link: 'scale_tb_m.php',
    title: 'Весы ТВ-M_RP с принтером этикеток',
    desc: 'Напольные товарные весы с вертикальной стойкой. Жидкокристаллический индикатор с подсветкой. Встроенный аккумулятор обеспечивает автономную работу весов до 15 часов. Счетный режим.',
    price: '218655',
    img: 'images/scale/92.jpg',
    position: ['floor'],
    weight: 500,
    interface: ['usb', 'serial', 'lan'],
    integration: [],
    series: 'tb',
  },
  // {
  //     link: "scale_tbs_ra.php",
  //     title: "Весы товарные ТВ-S_RA с регистрацией товароучетных операций",
  //     desc: "Напольные товарные весы с вертикальной стойкой. Возможна работа в счетном режиме. Обеспечена возможность подключения к весам сканера штрихкодов и дозатора. Весы регистрируют товароучетные операции (прием, отпуск, списание, инвентаризация). Легко интегрируются в системы учета, в том числе в режиме весового терминала сбора данных. ",
  //     price: "96285",
  //     img: "images/scale/91.jpg",
  //     position: ["floor"],
  //     weight: 200,
  //     interface: ["serial", "usb"],
  //     integration: [],
  //     series: "tb",
  // },
  {
    link: 'scale_RLS1100.php',
    title: 'Весы Rongta RLS1100 с принтером этикеток',
    desc: 'Весы Rongta RLS1100 успешно могут использоваться в магазинах, в супермаркетах и на фасовке, они не только могут взвешивать товар, но и производить полную калькуляцию покупки. Вакуумно-флуоресцентный дисплей покупателя установлен на высокой и устойчивой стойке, и хорошо виден над витринами.',
    price: '158921',
    img: 'images/rongta_rls/1rongta.jpg',
    position: ['trade'],
    weight: 32,
    interface: ['serial', 'lan'],
    integration: [],
    series: '4d',
  },
  {
    link: 'scale_RLS1100C.php',
    title: 'Весы Rongta RLS1100 C с принтером этикеток',
    desc: 'Весы Rongta RLS1100 C успешно могут использоваться в магазинах, в супермаркетах и на фасовке, они не только могут взвешивать товар, но и производить полную калькуляцию покупки.',
    price: '158920',
    img: 'images/rongta_rlsc/rongta_2mfruits_wm.png',
    position: ['trade'],
    weight: 32,
    interface: ['serial', 'lan'],
    integration: [],
    series: '4d',
  },
  {
    link: 'scanpal_eda_50.php',
    title: 'ТСД терминал Honeywell ScanPal EDA50',
    price: '231650',
    img: 'images/terminal/1.png',
    code: '7001',
  },
  {
    link: 'dors_1015.php',
    title: 'Счетчики банкнот DORS CT1015',
    price: '30988',
    img: 'images/schetchiki/11.jpg',
    code: '8001',
  },
  {
    link: 'dors_1040.php',
    title: 'Счетчики банкнот жидкокристаллические DORS CT1040',
    price: '53582',
    img: 'images/schetchiki/2.png',
    code: '8002',
  },
  {
    link: 'dors_600.php',
    title: 'Счетчики банкнот светодиодные DORS 600 М2',
    price: '106907',
    img: 'images/schetchiki/3.png',
    code: '8003',
  },
  {
    link: 'magner_35.php',
    title: 'Счетчики банкнот светодиодные Magner 35S',
    price: '246239',
    img: 'images/schetchiki/6.jpg',
    code: '8006',
  },
  {
    link: 'magner_2003.php',
    title: 'Счетчики банкнот жидкокристаллические Magner 35-2003',
    price: '209536',
    img: 'images/schetchiki/7.jpg',
    code: '8007',
  },
  {
    link: 'magner_75.php',
    title: 'Счетчики банкнот жидкокристаллические Magner 75 D',
    price: '301716',
    img: 'images/schetchiki/8.png',
    code: '8008',
  },
  {
    link: 'dors_750.php',
    title: 'Счетчики монохромные жидкокристаллические DORS 750',
    price: '351107',
    img: 'images/schetchiki/4.jpg',
    code: '8004',
  },
  {
    link: 'dors_800.php',
    title: 'Счетчики банкнот цветные сенсорные DORS 800',
    price: '432632',
    img: 'images/schetchiki/5.jpg',
    code: '8005',
  },
  {
    link: 'magner_100.php',
    title: 'Счетчики банкнот графические Magner 100',
    price: '708158',
    img: 'images/schetchiki/9.png',
    code: '8009',
  },
  {
    link: 'magner_150.php',
    title: 'Счетчики банкнот графические Magner 150',
    price: '767000',
    img: 'images/schetchiki/10.jpg',
    code: '8010',
  },
  {
    link: 'magner_175.php',
    title: 'Счетчики банкнот жидкокристаллические Magner 175',
    price: '1235000',
    img: 'images/schetchiki/20.png',
    code: '8011',
  },
  {
    link: 'dors_50.php',
    title: 'Ультрафиолетовые детекторы банкнот DORS 50',
    price: '5345',
    img: 'images/detector/1.jpg',
    code: '9001',
  },
  {
    link: 'dors_60.php',
    title: 'Ультрафиолетовые детекторы банкнот DORS 60',
    price: '8315',
    img: 'images/detector/2.jpg',
    code: '9002',
  },
  {
    link: 'dors_125.php',
    title: 'Ультрафиолетовые детекторы банкнот DORS',
    price: '8639',
    img: 'images/detector/3.jpg',
    code: '9003',
  },
  {
    link: 'dors_1000.php',
    title: 'Инфракрасные детекторы банкнот DORS 1000 M3',
    price: '33854',
    img: 'images/detector/4.jpg',
    code: '9004',
  },
  {
    link: 'dors_1100.php',
    title: 'Инфракрасные детекторы банкнот DORS 1100',
    price: '53454',
    img: 'images/detector/5.jpg',
    code: '9005',
  },
  {
    link: 'dors_1170.php',
    title: 'Инфракрасные детекторы банкнот DORS 1170D',
    price: '86380',
    img: 'images/detector/6.jpg',
    code: '9006',
  },
  {
    link: 'dors_1250.php',
    title: 'Инфракрасные детекторы банкнот DORS 1250',
    price: '100968',
    img: 'images/detector/8.jpg',
    code: '9008',
  },
  {
    link: 'dors_230.php',
    title: 'Автоматические детекторы банкнот DORS 230',
    price: '117229',
    img: 'images/detector/10.jpg',
    code: '9010',
  },
  {
    link: 'dors_1300.php',
    title: 'Инфракрасные детекторы банкнот DORS 1300',
    price: '148482',
    img: 'images/detector/9.jpg',
    code: '9009',
  },
  {
    link: 'radio_frequency.php',
    title: 'Радиочастотные антикражные ворота',
    price: '82934',
    img: 'images/eas/4.jpg',
    code: '9030',
  },
  {
    link: 'mini_square.php',
    title: 'Радиочастотная бирка Mini square',
    price: '31',
    img: 'images/eas/7.jpg',
    code: '9031',
  },
  {
    link: 'radio_golf.php',
    title: 'Радиочастотная бирка Golf',
    price: '84',
    img: 'images/eas/8.png',
    code: '9032',
  },
  {
    link: 'radio_bottle.php',
    title: 'Радиочастотная бирка Bottle tag',
    price: '185',
    img: 'images/eas/14.jpg',
    code: '9033',
  },
  {
    link: 'puller_universal.php',
    title: 'Съемник универсальный',
    price: '10462',
    img: 'images/eas/6.jpg',
    code: '9035',
  },
  {
    link: 'radio_label.php',
    title: 'Самоклеющиеся радиочастотные защитные этикетки',
    price: '6380',
    img: 'images/eas/10.jpg',
    code: '9036',
  },
  {
    link: 'radio_deactivator.php',
    title: 'Радиочастотный деактиватор',
    price: '38277',
    img: 'images/eas/10.jpg',
    code: '9037',
  },
  {
    link: 'acoustomagnetic.php',
    title: 'Акустомагнитная противокражная система',
    price: '165867',
    img: 'images/eas/1.jpg',
    code: '9038',
  },
  {
    link: 'acoustomagnetic_tag.php',
    title: 'Акустомагнитная бирка Карандаш',
    price: '57',
    img: 'images/eas/2.jpg',
    code: '9039',
  },
  {
    link: 'loop.php',
    title: 'Антикражный тросик',
    price: '5742',
    img: 'images/eas/9.jpg',
    code: '9034',
  },
  {
    link: 'acoustomagnetic_bottle.php',
    title: 'Акустомагнитная бирка Bottle tag',
    price: '204',
    img: 'images/eas/13.png',
    code: '9040',
  },
  {
    link: 'acoustomagnetic_label.php',
    title: 'Акустомагнитная этикетка лист',
    price: '1403',
    img: 'images/eas/3.jpg',
    code: '9041',
  },
  {
    link: 'acoustomagnetic_deactivator.php',
    title: 'Акустомагнитный деактиватор',
    price: '63795',
    img: 'images/eas/5.png',
    code: '9042',
  },
];

if (document.querySelector('.product-items') != null) {
  const productItems = document.querySelector('.product-items');

  let mainLength = document.querySelectorAll('.main');

  for (let index = 0; index < mainLength.length; index++) {
    for (let j = 0; j < data5.length; j++) {
      let mainLengthLink = mainLength[index].children[0].href
        .split('/')
        .pop()
        .split('#')[0]
        .split('?')[0];

      if (mainLengthLink == data5[j].link) {
        var formatter = function (priceSum) {
          let mn = 0;
          let price = priceSum.toString();
          for (let ij = price.length; ij > 0; ij--) {
            if (mn % 3 == 0) {
              // price.splice(ij, 0, " ")
              price = [price.slice(0, ij), ' ', price.slice(ij)].join('');
            }
            mn++;
          }
          return price;
        };

        mainLength[index].children[0].innerHTML += `
                    <div class="search-price-container2"><span class="search-price">${formatter(
                      data5[j].price,
                    )} тг</span></div>
                `;

        mainLength[index].children[1].innerHTML = `
                        <p><span class="item-price-indicator_second">Цена:<br> </span><span class="item_price_second">${formatter(
                          data5[j].price,
                        )} тг </span></p>
                        <a class="hvr-outline-out button2" href="${data5[j].link}">Перейти</a>
                    `;
        break;
      } else {
      }
    }
  }
}

function dynamicallyLoadScript() {
  var script = document.createElement('script');
  script.innerHTML = `
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(83745763, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true,
        ecommerce:"dataLayer"
   });
    `;
  var noScript = document.createElement('noscript');

  var diV = document.createElement('div');
  diV.innerHTML = `
		<img src="https://mc.yandex.ru/watch/83745763" style="position:absolute; left:-9999px;" alt="" />
    `;
  noScript.appendChild(diV);

  document.querySelector('body').appendChild(script);

  document.querySelector('body').appendChild(noScript);

  var scriptSecond = document.createElement('script');
  scriptSecond.async = true;
  scriptSecond.src = 'https://www.googletagmanager.com/gtag/js?id=G-20ECD7YT35';

  var scriptThird = document.createElement('script');
  scriptThird.innerHTML = ` 
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
    
        gtag('config', 'G-20ECD7YT35');
    `;

  document.querySelector('body').appendChild(scriptSecond);
  document.querySelector('body').appendChild(scriptThird);
}

dynamicallyLoadScript();

if (document.querySelectorAll('.col-md-8, .single-right-left, .simpleCart_shelfItem') != null) {
  const path = document.querySelectorAll('.col-md-8, .single-right-left, .simpleCart_shelfItem');
  for (let index = 0; index < data5.length; index++) {
    const element = data5[index];
    if (element.link === filename || element.link.split('.').slice(0, -1).join('.') === filename) {
      var formatMoney = function (priceSum) {
        let mn = 0;
        let price = priceSum.toString();
        for (let ij = price.length; ij > 0; ij--) {
          if (mn % 3 == 0) {
            price = [price.slice(0, ij), ' ', price.slice(ij)].join('');
          }
          mn++;
        }
        return price;
      };

      path[1].children[3].chiPldren[1].innerHTML = `${formatMoney(element.price)} тг`;
      document.getElementById('fly').setAttribute('data-price', element.price);
      break;
    }
  }
}

$(function () {
  function rescaleCaptcha() {
    var width = $('.g-recaptcha').parent().width();
    var scale;
    if (width < 302) {
      scale = width / 302;
    } else {
      scale = 1.0;
    }

    $('.g-recaptcha').css('transform', 'scale(' + scale + ')');
    $('.g-recaptcha').css('-webkit-transform', 'scale(' + scale + ')');
    $('.g-recaptcha').css('transform-origin', '0 0');
    $('.g-recaptcha').css('-webkit-transform-origin', '0 0');
  }

  rescaleCaptcha();
  $(window).resize(function () {
    rescaleCaptcha();
  });
});

// _____________________________Copyright year change___________________________________

let copyrightText = document.querySelector('.copy-right');
copyrightText.innerHTML = `© 2010-2022 SoftGroup`;

let footer = document.querySelector('footer');

footer.innerHTML = ``;
