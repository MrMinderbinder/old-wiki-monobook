"use strict";

// for compatibility reasons
var browser = chrome;

var monobookSkinActivation = true;

/**
 * Loads the current settings.
 */
function onStartUp() {
    // load stored settings from local storage
	browser.storage.local.get(onSettingsLoaded);
}

/**
 * Called when the settings are loaded from the local storage.
 * 
 * @param {[key: string]: any} items The items from the local storage.
 */
function onSettingsLoaded(items) {
    parseSettings(items);
    updateEnabledRulesets();
}

/**
 * Called when the settings are changed in the local storage.
 * 
 * @param {[key: string]: any} changed The changed items from the local storage.
 */
 function onSettingsChanged(changed) {
    parseChangedSettings(changed);
    updateEnabledRulesets();
}

/**
 * Parses the items from the local storage to the global variables in this worker script.
 * 
 * @param {[key: string]: any} items The items from the local storage.
 */
function parseSettings(items) {
    monobookSkinActivation = items.hasOwnProperty('monobook_skin_activation') ? items.monobook_skin_activation : true;
}

/**
 * Parses the items from the local storage to the global variables in this worker script.
 * 
 * @param {[key: string]: any} items The items from the local storage.
 */
 function parseChangedSettings(items) {
    monobookSkinActivation = items.hasOwnProperty('monobook_skin_activation') ? items.monobook_skin_activation.newValue : true;
}

/**
 * Updates the enabled rulesets according to the activation state in the local storage.
 */
function updateEnabledRulesets() {
    let disableRulesetIds = [];
    let enableRulesetIds = [];

    if (monobookSkinActivation) {
        enableRulesetIds.push("apply_monobook_skin");
        disableRulesetIds.push("remove_monobook_skin");
    } else {
        enableRulesetIds.push("remove_monobook_skin");
        disableRulesetIds.push("apply_monobook_skin");
    }

    browser.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: disableRulesetIds,
        enableRulesetIds: enableRulesetIds
    });
}

browser.runtime.onInstalled.addListener(onStartUp);
browser.runtime.onStartup.addListener(onStartUp);

browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName != "local")
        return;

    onSettingsChanged(changes);
});