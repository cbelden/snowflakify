var requestID = null;

chrome.storage.local.get('snowflakify-options', function(data) {
    initializeContent(data['snowflakify-options']);
});

function initializeContent(options){
    // TODO move image url to the options page: allow users to specify the snowflake image
    options = options || {};
    options.imageUrl = options.imageUrl || chrome.extension.getURL('images/snowflake.png');

    // Start the snow storm!
    Snowflakify.initialize(options);
    requestID = requestAnimationFrame(animate);

    // Listen to the navbar action
    chrome.runtime.onMessage.addListener(toggleAnimation);
}

function animate(t) {
    Snowflakify.animate(t);
    requestID = requestAnimationFrame(animate);
}

function toggleAnimation(request, sender) {
    if (requestID) {
        cancelAnimationFrame(requestID);
        Snowflakify.cancelAnimation();
        requestID = null;
    }
    else {
        requestID = requestAnimationFrame(animate);
    }
}