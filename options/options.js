var density  = document.getElementById('density'),
    speed    = document.getElementById('speed'),
    rotation = document.getElementById('rotation'),
    opacity  = document.getElementById('opacity'),
    image    = document.getElementById('imageUrl'),
    save     = document.getElementById('save');

var controls = [density, speed, rotation, opacity, image];

// Get stored options data and initialize the sliders once retrieved
chrome.storage.local.get('snowflakify-options', function(data){
    initializeControls(data['snowflakify-options'], controls);
});

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
};

function initializeControls(options, controls) {
    var val = null,
        i = 0,
        control = null;

    // Set the slider value of each control
    for(i; i < controls.length; i++) {

        control = controls[i];
        val = options[control.id];

        // Set default value for range controls if input is missing or invalid
        if (control.type == 'range' && !val) val = 50;
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
