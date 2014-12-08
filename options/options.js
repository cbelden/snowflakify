(function(Snowflakify, _, chrome) {
    var density       = document.getElementById('density'),
        speed         = document.getElementById('speed'),
        rotation      = document.getElementById('rotation'),
        opacity       = document.getElementById('opacity'),
        imageUrl      = document.getElementById('imageUrl'),
        saveImageBtn  = document.getElementById('saveImageUrl'),
        rangeControls = [density, speed, rotation, opacity],
        controls      = rangeControls.concat(imageUrl)

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

    // Image url events
    saveImageBtn.onclick = saveImageUrl;
    imageUrl.onkeydown = updateSaveButton;

    // Start snowflakify animation
    Snowflakify.initialize({imageUrl: chrome.extension.getURL('images/snowflake.png')});
    Snowflakify.startAnimation();

    function saveSliderSettings() {
        chrome.storage.local.get('snowflakify-options', updateSliderSettings);
    }

    function saveImageUrl() {
        chrome.storage.local.get('snowflakify-options', updateImageUrl);
    }

    function updateSliderSettings(data){
        data = data['snowflakify-options'];

        // Get the updated slider values
        _.forEach(rangeControls, function(control) {
            data[control.id] = control.value;
        });

        // Update the snowflakify options with the new slider values
        chrome.storage.local.set({'snowflakify-options': data}, function() { restartAnimation(data) });
    }

    function updateImageUrl(data){
        data = data['snowflakify-options'];
        data[imageUrl.id] = imageUrl.value

        // Update the image url
        chrome.storage.local.set({'snowflakify-options': data}, function() { restartAnimation(data) });

        // Update save button
        saveImageBtn.className = "button";
        saveImageBtn.value = "Saved!";
    }

    function initializeControls(options, defaults) {
        var val = null;

        options = options || {};
        defaults = defaults || {};

        // Initialize each range control
        _.forEach(controls, function(control) {
            // Get saved/default value for this control
            val = options[control.id] || defaults[control.id];

            // Ensure value is valid for range controls
            if (control.type === 'range' && (!val || typeof(val) !== 'number')) val = 50;
            if (val < 0) val = 0;
            if (val > 100) val = 100;

            // Finally assign the control's value
            control.value = val;

            // Assign onmousedown handler for range controls
            if (control.type === 'range') control.onmouseup = saveSliderSettings;
        });
    }

    function updateSaveButton(e) {
        saveImageBtn.className = "dirty button";
        saveImageBtn.value = "Save";
    }

    function restartAnimation(data) {
        // Set default picture if not specified
        if (!data.imageUrl) {
            data.imageUrl = chrome.extension.getURL('images/snowflake.png');
        }

        // Finally, restart animation
        Snowflakify.restartAnimation(data);
    }

})(Snowflakify, _, chrome);
