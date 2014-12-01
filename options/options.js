(function(Snowflakify, chrome) {
    var density  = document.getElementById('density'),
        speed    = document.getElementById('speed'),
        rotation = document.getElementById('rotation'),
        opacity  = document.getElementById('opacity'),
        image    = document.getElementById('imageUrl'),
        save     = document.getElementById('save'),
        controls = [density, speed, rotation, opacity, image],

        defaults = {
            density: 50,
            speed: 50,
            rotation: 50,
            opacity: 100,
            imageUrl: '',
        };

    // Get stored options data and initialize the sliders once retrieved
    chrome.storage.local.get('snowflakify-options', function(data){
        initializeControls(controls, defaults, data['snowflakify-options']);
    });

    // Start snowflakify animation
    Snowflakify.initialize({imageUrl: chrome.extension.getURL('images/snowflake.png')});
    Snowflakify.startAnimation();

    // Subscribe to the Save event
    save.onclick = function(e) {
        e.preventDefault();
        var options = {},
            i = 0,
            control = null;

        // Construct options object
        for(i; i < controls.length; i++) {
            control = controls[i];
            if (control.type == 'range') options[control.id] = parseInt(control.value, 10);
            else options[control.id] = control.value;
        }

        chrome.storage.local.set({'snowflakify-options': options});

        save.className = "button";
        save.value = "Saved!";

        // Restart the animation so user can see updated settings in action!
        options.imageUrl || (options.imageUrl = chrome.extension.getURL('images/snowflake.png'));
        Snowflakify.restartAnimation(options);
    };

    function initializeControls(controls, defaults, options) {
        var val = null,
            i = 0,
            control = null;

        options = options || {};
        defaults = defaults || {};

        // Set the slider value of each control
        for(i; i < controls.length; i++) {
            control = controls[i];

            // Get saved/default value for this control
            val = options[control.id] || defaults[control.id];

            // Ensure value is valid for range controls
            if (control.type === 'range' && (!val || typeof(val) !== 'number')) val = 50;
            if (val < 0) val = 0;
            if (val > 100) val = 100;

            control.value = val;
            control.onmousedown = saveDirty;
        }
    }

    function saveDirty(e) {
        save.className = "dirty button";
        save.value = "Save";
    }

})(Snowflakify, chrome);
