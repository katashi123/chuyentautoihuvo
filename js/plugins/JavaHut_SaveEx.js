//=============================================================================
// JavaHut's Save Extension Plugin
// JavaHut_SaveEx.js
// 
// Known Issues:
//   -Autosave      : Autosave will fail if the map contains an event that has
//       a movement route set to move itself. This is because it contains a
//       reference to itself, which breaks the JsonEx.stringify call in the
//       DataManager.saveGameWithoutRescue method.
//       FIX: Use the autonomous movement, or another event's movement route
//            to move the event as needed.
// 
//=============================================================================

var Imported = Imported || {};
Imported.JavaHut_SaveEx = 1.03;

//=============================================================================
 /*:
 * @plugindesc v1.03 Allows for more advanced functions for the game save and load features.
 * @author JavaHut
 * 
 * @param --General--
 * @default ---------------
 * 
 * @param Save File Name
 * @desc The name that appears before the file number. Used for the actual file and the save display. Default: Save
 * @default Save
 * 
 * @param Enable Autosave
 * @desc Enables the autosave feature. Use the autosave plugin command to save the game at any time.
 * @default true
 * 
 * @param Autosave Slot #
 * @desc The slot position to save the autosave in (from 1 to the maximum amount). Default: 1
 * @default 1
 * 
 * @param Max Save Slots
 * @desc The maximum amount of save slots that the player can use. Autosave requires at least 1. Default: 20
 * @default 20
 * 
 * @param Use Web Prepend
 * @desc If the game's title should be prepended to the web save keys. Only applies to web browser gaming.
 * @default true
 * 
 * @param Menu Load Command
 * @desc Allow a load game option on the game menu. Leave blank for no menu load option.
 * @default Load
 * 
 * @param --Warnings--
 * @default ---------------
 * 
 * @param Warning Prompt Width
 * @desc The width of the warning prompt box. Use 0 to allow the width to be based on message width. Default: 0
 * @default 0
 * 
 * @param Warning Select Width
 * @desc The width of the warning prompt selection box. Use 0 to allow the width to be based on largest choice. Default: 0
 * @default 0
 * 
 * @param Warning Confirm Text
 * @desc The text for a warning confirmation button. Default: OK
 * @default OK
 * 
 * @param Warning Cancel Text
 * @desc The text for a warning cancelation button. Default: Cancel
 * @default Cancel
 * 
 * @param Exit Game Warning
 * @desc The message to display if exiting the game without saving. Leave blank for no warning. Default: Exit Without Saving?
 * @default Exit Without Saving?
 * 
 * @param Save Overwrite Warning
 * @desc The message to display when overwriting a save file. Leave blank for no warning. Default: Confirm Save Overwrite?
 * @default Confirm Save Overwrite?
 * 
 * @param Load Game Warning
 * @desc The message to display if loading from an active game. Leave blank for no warning. Default: Abort Current Game?
 * @default Abort Current Game?
 * 
 * @param --Save Row Items--
 * @default ---------------
 * 
 * @param Item Alignment
 * @desc top, middle, or bottom. The name/image/title/play time will align to the top, middle, or bottom of the save row.
 * @default top
 * 
 * @param Show Save Title
 * @desc If the saved title should be displayed inside the save row.
 * @default true
 * 
 * @param Use Map Display Name
 * @desc If the map's display name property should be used for the save file title. Otherwise the Game Title is used.
 * @default true
 * 
 * @param Show Party Members
 * @desc If the saved party members should be displayed inside the save row.
 * @default true
 * 
 * @param Party Member Height
 * @desc The height of a party member sprite. Default: 48
 * @default 48
 * 
 * @param Show Play Time
 * @desc If the saved play time should be displayed inside the save row.
 * @default true
 * 
 * @param --Screenshot Image--
 * @default ---------------
 * 
 * @param Enable Screenshot
 * @desc If the save file should have a screenshot image.
 * @default true
 * 
 * @param Screenshot Directory
 * @desc The directory that the save file screenshot will be stored in. Default: save
 * @default save
 * 
 * @param Save Scale
 * @desc The percentage to scale down the screenshot. From 10 to 100 (20 is automatically used for web storage). Default: 50
 * @default 50
 * 
 * @param Display Scale
 * @desc The percentage to scale the image inside the save row when displaying it. From 10 to 100. Default: 100
 * @default 100
 * 
 * @param Image File Type
 * @desc The type of image to save as: png or jpeg
 * @default png
 * 
 * @param JPEG File Quality
 * @desc The quality of the image, from 0 to 100. Only used for jpeg file type. Default: 50
 * @default 50
 * 
 * @param Border Color
 * @desc The hexidecimal border color for the screenshot image. Default: #ffffff (sets to white)
 * @default #ffffff
 * 
 * @param Border Thickness
 * @desc The border thickness for the screenshot image. Default: 2
 * @default 2
 * 
 * @help
 * ============================================================================
 * Important
 * ============================================================================
 * If any of the plugin parameters are changed, please delete any save files
 * that exist before running the game to prevent errors. To delete save files
 * in a browser game, while the game is running, press F8 to open the console,
 * click on "Resources" at the top, then click on the down arrow for
 * "Local Storage" on the left side, select the file:// storage and delete
 * all the save data.
 * 
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin allows for more advanced functions for the game save and load
 * features, such as saving a screenshot with a save file, showing/hiding items
 * on the save/load rows, or using the autosave plugin command to save the
 * game in an autosave slot.
 * 
 * ============================================================================
 * Plugin Command Instructions
 * ============================================================================
 * Note: All commands are case sensitive.
 * 
 * autosave
 *     Function      : Saves the current game in the autosave slot.
 *                     When you autosave, make sure if the Enable Screenshot
 *                     is true that the screen is not fading in/out and that
 *                     the player is not transferring to another map.
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.03: Added Warning Select Width parameter for custom prompt
 *               selector width.
 *               Fixed not being able to override Scene_Prompt and
 *               Window_Prompt from other scripts.
 * Version 1.02: Added Warning Prompt Width parameter for custom prompt width
 * Version 1.01: Fixed a bug that caused the load warning to display when
 *               loading from the main menu.
 *               Fixed a bug that allowed autosave to trigger when loading the
 *               autosave file from the main menu.
 * Version 1.00: Plugin completed.
 */
//=============================================================================

// ==============================
// * JavaHut
// ==============================

var JavaHut = JavaHut || {};
JavaHut.SaveEx = JavaHut.SaveEx || {};

/**
* Checks if a value is "true" or true.
* @param {Mixed} value
* @returns {Boolean} If the value is true, otherwise false
*/
JavaHut._bool = JavaHut._bool || function (value) {
   return (value === "true" || value === true) ? true : false;
};

// ==============================
// * Plugin Scope
// ==============================

(function ($, $$) {
    
    "use strict";
    
// ==============================
// * Parameters
// ==============================
    
    $.Parameters = PluginManager.parameters("JavaHut_SaveEx");
    $.Param = $.Param || {};
    // General
    $.Param.SVEX_saveName = String($.Parameters["Save File Name"]);
    $.Param.SVEX_autosave = JavaHut._bool($.Parameters["Enable Autosave"]);
    $.Param.SVEX_autosaveId = Number($.Parameters["Autosave Slot #"]);
    $.Param.SVEX_maxSlots = Number($.Parameters["Max Save Slots"]);
    $.Param.SVEX_webPrepend = JavaHut._bool($.Parameters["Use Web Prepend"]);
    $.Param.SVEX_loadCommand = String($.Parameters["Menu Load Command"]);
    // Warnings
    $.Param.SVEX_boxWidth = Number($.Parameters["Warning Prompt Width"]);
    $.Param.SVEX_cursorWidth = Number($.Parameters["Warning Select Width"]);
    $.Param.SVEX_okText = String($.Parameters["Warning Confirm Text"]);
    $.Param.SVEX_cancelText = String($.Parameters["Warning Cancel Text"]);
    $.Param.SVEX_exitWarning = String($.Parameters["Exit Game Warning"]);
    $.Param.SVEX_saveWarning = String($.Parameters["Save Overwrite Warning"]);
    $.Param.SVEX_loadWarning = String($.Parameters["Load Game Warning"]);
    // Save Row Items
    $.Param.SVEX_itemAlign = String($.Parameters["Item Alignment"]);
    $.Param.SVEX_showTitle = JavaHut._bool($.Parameters["Show Save Title"]);
    $.Param.SVEX_useMapName = JavaHut._bool($.Parameters["Use Map Display Name"]);
    $.Param.SVEX_showParty = JavaHut._bool($.Parameters["Show Party Members"]);
    $.Param.SVEX_partyHeight = Number($.Parameters["Party Member Height"]);
    $.Param.SVEX_showPlayTime = JavaHut._bool($.Parameters["Show Play Time"]);
    // Screenshot Image
    $.Param.SVEX_enableSc = JavaHut._bool($.Parameters["Enable Screenshot"]);
    $.Param.SVEX_imgDir = String($.Parameters["Screenshot Directory"]);
    $.Param.SVEX_saveScale = Math.max(Number($.Parameters["Save Scale"]), 10) / 100;
    $.Param.SVEX_imageScale = Math.max(Number($.Parameters["Display Scale"]), 10) / 100;
    $.Param.SVEX_fileType = String($.Parameters["Image File Type"]);
    $.Param.SVEX_fileQuality = Number($.Parameters["JPEG File Quality"]);
    $.Param.SVEX_BorderColor = String($.Parameters["Border Color"]);
    $.Param.SVEX_BorderThickness = Number($.Parameters["Border Thickness"]) * 10;
    // Adjustments
    if ($.Param.SVEX_fileType !== "jpeg") { $.Param.SVEX_fileType = "png"; }
    if ($.Param.SVEX_BorderColor.indexOf("#") !== 0) {
        $.Param.SVEX_BorderColor = "#" + $.Param.SVEX_BorderColor;
    }
    
// ==============================
// * Game_Interpreter
// ==============================
    
    // Overwritten Methods
    
    // Get commands sent to this plugin
    $.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        switch (command) {
            case "autosave" :
                $._autosave();
                break;
            default :
                $.Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };
    
// ==============================
// * Load Command
// ==============================

if ($.Param.SVEX_loadCommand !== "") {
    
    // Overwritten Methods
    
    // Allow the load menu command
    $.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        this.addCommand($.Param.SVEX_loadCommand, "loadGame", DataManager.isAnySavefileExists());
    };
    
    // Set the load handler
    $.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        $.Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("loadGame", this.commandLoad.bind(this));
    };
    Scene_Menu.prototype.commandLoad = function () {
        $._loadWarning = ($.Param.SVEX_loadWarning !== "");
        SceneManager.push(Scene_Load);
    };
    
}
    
// ==============================
// * Scene_Save & Scene_Load
// ==============================
    
    // Overwritten Methods
    
    // Allow warning for save overwrite
    $.Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function () {
        var conf = function () {
            $._recentSave = true;
            $.Scene_Save_onSavefileOk.call(this);
        };
        var saveWindow = SceneManager._scene._listWindow;
        saveWindow = (saveWindow instanceof Window_SavefileList) ? saveWindow : null;
        
        if ($.Param.SVEX_saveWarning !== ""
                && DataManager.isThisGameFile(this.savefileId())
                && saveWindow) {
            // The conf callback is bound by the $._setWarning method
            $._setWarning.call(this, $.Param.SVEX_saveWarning, conf, false);
        } else {
            saveWindow = null;
            conf.call(this);
        }
    };
    
    // Allow warning for game load from game menu
    $.Scene_Load_onSavefileOk = Scene_Load.prototype.onSavefileOk;
    Scene_Load.prototype.onSavefileOk = function () {
        var conf = function () {
            $._recentSave = false;
            $.Scene_Load_onSavefileOk.call(this);
        };
        var loadWindow = SceneManager._scene._listWindow;
        loadWindow = (loadWindow instanceof Window_SavefileList) ? loadWindow : null;
        
        if ($._loadWarning
                && DataManager.isThisGameFile(this.savefileId())
                && loadWindow) {
            $._setWarning.call(this, $.Param.SVEX_loadWarning,
                conf, true);
        } else {
            // Allow autosave prevention when loading from main menu
            $._preventAutosave();
            conf.call(this);
        }
    };
    $.Scene_Load_terminate = Scene_Load.prototype.terminate;
    Scene_Load.prototype.terminate = function () {
        $.Scene_Load_terminate.call(this);
    };
    
// ==============================
// * Other Scenes
// ==============================
    
    // Allow for exit warning
    $.Scene_Menu_commandGameEnd = Scene_Menu.prototype.commandGameEnd;
    Scene_Menu.prototype.commandGameEnd = function () {
        var conf = function (origin) {
            $._recentSave = false;
            $._loadWarning = false;
            if (origin === undefined) {
                SceneManager.goto(Scene_Title);
            } else {
                $.Scene_Menu_commandGameEnd.call(this);
            }
        };
        if ($.Param.SVEX_exitWarning && !$._recentSave) {
            $._setWarning.call(this, $.Param.SVEX_exitWarning, conf, true);
        } else {
            conf.call(this, true);
        }
    };
    
    // Allow resetting of properties on exits
    $.Scene_Menu_popScene = Scene_Menu.prototype.popScene;
    Scene_Menu.prototype.popScene = function () {
        $._recentSave = false;
        $._loadWarning = false;
        $.Scene_Menu_popScene.call(this);
    };
    
// ==============================
// * Window_SavefileList
// ==============================
    
    // New Methods
    
    /**
     * Draw the party characters and title if needed
     * @param {Object} info The draw info object
     * @param {Object} rect The rectangle object
     * @param {Bool} valid If the party memebers are valid
     * @param {Number} x The x position of the elements to draw
     */
    Window_SavefileList.prototype.drawExtras = function (info, rect, valid, x) {
        var y = 0;
        var title = $.Param.SVEX_showTitle;
        var single = (valid && !title) || (!valid && title);
        var bottom = rect.y + rect.height - ($._rowPadding / 2);
        
        if (valid) {
            // drawPartyCharacters draws from the bottom up, so the y needs
            // to start at the base of the characters. x + padding is to adjust the
            // character sprite offset to match the padding of the title text
            y = (single) ? bottom - $._getAlignOffset(rect.height - ($._rowPadding / 2),
                $.Param.SVEX_partyHeight, true) : bottom;
            this.drawPartyCharacters(info, x + this.padding, y);
        }
        if (title) {
            y = (single) ? rect.y + $._getAlignOffset(rect.height, this.lineHeight()) : rect.y;
            this.drawGameTitle(info, x, y, rect.width - $._fileNameWidth);
        }
    };
    
    // Overwritten Methods
    
    // Allow positioning of the File ID
    Window_SavefileList.prototype.drawItem = function (index) {
        var id = index + 1;
        var valid = DataManager.isThisGameFile(id);
        var info = DataManager.loadSavefileInfo(id);
        var rect = this.itemRectForText(index);
        this.resetTextColor();
        
        if (this._mode === "load") {
            this.changePaintOpacity(valid);
        }
        this.drawFileId(id, rect.x, rect.y, rect.height);
        if (info) {
            this.changePaintOpacity(valid);
            this.drawContents(info, rect, valid);
            this.changePaintOpacity(true);
        }
    };
    
    // Allow Autosave text for first file save slot, and text alignment
    Window_SavefileList.prototype.drawFileId = function (id, x, y, height) {
        // Check for no config or global
        if (id <= 0) { return true; }
        if ($._fileNameWidth === null) {
            // Get the larger value of autosave width or save name width
            $._fileNameWidth = Math.max($._measureTextWidth("Autosave"),
                $._measureTextWidth($.Param.SVEX_saveName + " " + $.Param.SVEX_maxSlots));
        }

        y += $._getAlignOffset(height, this.lineHeight());

        if (id === $.Param.SVEX_autosaveId && $.Param.SVEX_autosave) {
            this.drawText("Autosave", x, y, $._fileNameWidth + $._fileNamePadding);
        } else {
            this.drawText($.Param.SVEX_saveName + " " + id, x, y,
                    $._fileNameWidth + $._fileNamePadding);
        }
    };
    
    // Draw all the save file contents
    $.Window_SavefileList_drawContents = Window_SavefileList.prototype.drawContents;
    Window_SavefileList.prototype.drawContents = function (info, rect, valid) {
        // No config or global
        if (info.saveId <= 0) { return true; }
        
        var bmp = null;
        var src = $._realFileName;
        var width = 0;
        var height = 0;
        var offset = 0;
        var titleX = rect.x + $._fileNameWidth + ($._fileNamePadding * 2);
        var isAuto = (info.saveId === $.Param.SVEX_autosaveId && $.Param.SVEX_autosave);
        valid = valid && $.Param.SVEX_showParty;
        
        if (isAuto) { src = "autosave"; }
        // Draw screenshot, title and party members if needed
        if (StorageManager.isLocalMode()) {
            if (!isAuto) { src += info.saveId; }
            src += "." + $.Param.SVEX_fileType;
            bmp = $._loadLocalSc(src);
        } else {
            bmp = $._loadWebSc(src, info.saveId);
        }
        if (bmp) {
            bmp.addLoadListener(function () {
                // Get new width from the ratio of the new height
                height = (rect.height - $._rowPadding) * $.Param.SVEX_imageScale;
                width = bmp.width / (bmp.height / height);
                titleX += width;
                // Check the image alignment
                offset = $._getAlignOffset(rect.height, height);
                
                this.contents.blt(bmp, 0, 0, bmp.width, bmp.height,
                    rect.x + $._fileNameWidth + $._fileNamePadding,
                    rect.y + offset, width, height);
                this.drawExtras(info, rect, valid, titleX);
            }.bind(this));
        } else {
            // No screenshot image to display
            this.drawExtras(info, rect, valid, titleX);
        }
        
        // Draw play time if needed
        if ($.Param.SVEX_showPlayTime) {
            offset = $._getAlignOffset(rect.height, this.lineHeight());
            this.drawPlaytime(info, rect.x, rect.y + offset, rect.width);
        }
    };
    
// ==============================
// * Scene_Manager
// ==============================
    
    // New Properties
    
    SceneManager._screenshot = null; // Use a screenshot for save files
    
    // New Methods
    
    /**
     * Makes a new screenshot and saves it in SceneManager._screenshot.
     */
    SceneManager._makeNewScreenshot = function () {
        this._screenshot = this.snap();
    };
    
    /**
     * Saves the current screenshot to the directory and filename specified.
     * @param {String} directory The directory to save to
     * @param {String} filename The filename without extension
     */
    SceneManager._saveScreenshot = function (directory, filename) {
        var sc = this._screenshot;
        var isLocal = StorageManager.isLocalMode();
        
        if (sc && $.Param.SVEX_enableSc) {
            var scale = (isLocal) ? $.Param.SVEX_saveScale : $._webScScale;
            var scaledWidth = sc._canvas.width * scale;
            var scaledHeight = sc._canvas.height * scale;
            var bmp = new Bitmap(scaledWidth, scaledHeight);
            var ctx = bmp._context;
            var quality = 0;
            var data = "";
            
            // Resize the screenshot into the new bmp
            bmp.blt(sc, 0, 0, sc.width, sc.height, 0, 0, scaledWidth, scaledHeight);
            // Create a border on the canvas
            ctx.strokeStyle = $.Param.SVEX_BorderColor;
            ctx.lineWidth = $.Param.SVEX_BorderThickness * scale;
            if (ctx.lineWidth > 0) { ctx.strokeRect(0, 0, scaledWidth, scaledHeight); }
            
            quality = ($.Param.SVEX_fileType !== "png") ? $.Param.SVEX_fileQuality / 100 : 1;
            data = bmp._canvas.toDataURL("image/" + $.Param.SVEX_fileType, quality);
            
            if (isLocal) {
                data = data.replace(/^.*,/, ""); // Remove the file info at the beginning
                directory = StorageManager.localFileDirectoryPath(true) + directory;
                StorageManager.saveToLocalFile(filename + "."
                        + $.Param.SVEX_fileType, data, true, directory);
            } else {
                $._saveWebSc(filename, data);
            }
        }
    };
    
    // Overwritten Methods
    
    // Allow for a normal snapshot without the blur
    SceneManager.snapForBackground = function () {
        if ($.Param.SVEX_enableSc) { this._makeNewScreenshot(); }
        this._backgroundBitmap = this.snap();
        this._backgroundBitmap.blur();
    };
    
// ==============================
// * StorageManager
// ==============================
    
    // Overwritten Methods
    
    // Allow prepend for web storage key
    $.StorageManager_webStorageKey = StorageManager.webStorageKey;
    StorageManager.webStorageKey = function (savefileId) {
        if (StorageManager.isLocalMode()) {
            return $.StorageManager_webStorageKey.call(this, savefileId);
        } else if (savefileId < 0) {
            return $._getWebFilename("Config");
        } else if (savefileId === 0) {
            return $._getWebFilename("Global");
        } else {
            return $._getWebFilename($._realFileName, savefileId);
        }
    };
    
    // Allow custom save file name and autosave
    $.StorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath = function (savefileId) {
        var name = $.StorageManager_localFilePath.call(this, savefileId);
        if (savefileId === $.Param.SVEX_autosaveId && $.Param.SVEX_autosave) {
            name = this.localFileDirectoryPath() + "autosave.rpgsave";
        } else if ((savefileId === $.Param.SVEX_autosaveId && !$.Param.SVEX_autosave)
                || savefileId > 0) {
            name = this.localFileDirectoryPath() + $._realFileName
                + savefileId + ".rpgsave";
        }
        
        return name;
    };
    
    // Allow files other than save files to be stored
    $.StorageManager_saveToLocalFile = StorageManager.saveToLocalFile;
    StorageManager.saveToLocalFile = function (filename, data, otherFile, path) {
        if (otherFile) {
            var fs = require("fs");
            // Use save directory if path is undefined
            path += (!path.match(/\/$/)) ? "/" : "";
            data = new Buffer(data, "base64");
            
            if (!fs.existsSync(path)) { fs.mkdirSync(path); }
            
            fs.writeFileSync(path + filename, data);
        } else {
            $.StorageManager_saveToLocalFile.call(this, filename, data);
        }
    };
    
    // Allow returning only base directory path
    StorageManager.localFileDirectoryPath = function (basePath) {
        var path = require("path");
        var base = path.dirname(process.mainModule.filename);
        return (basePath) ? base + "/" : path.join(base, "save/");
    };
    
// ==============================
// * DataManager
// ==============================
    
    // Overwritten Methods
    
    // Allow custom save slot amount
    DataManager.maxSavefiles = function() {
        return $.Param.SVEX_maxSlots;
    };
    
    // Allow scene display name for Save Slot title
    $.DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function () {
        var info = $.DataManager_makeSavefileInfo.call(this);
        var filename = (this._lastAccessedId === $.Param.SVEX_autosaveId && $.Param.SVEX_autosave)
            ? "autosave" : $._realFileName + this._lastAccessedId;
        info.title = ($.Param.SVEX_useMapName) ? $dataMap.displayName : info.title;
        info.saveId = this._lastAccessedId;
        
        if ($.Param.SVEX_enableSc) {
            if (!SceneManager._screenshot && this._lastAccessedId > 0) {
                SceneManager._makeNewScreenshot();
            }
            SceneManager._saveScreenshot($.Param.SVEX_imgDir, filename);
        }
        
        return info;
    };
    
    // Allow save titles for web to be different from the Game Title
    DataManager.isThisGameFile = function (savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (globalInfo && globalInfo[savefileId]) {
            if (StorageManager.isLocalMode()) {
                return true;
            } else {
                var savefile = globalInfo[savefileId];
                if (savefile.globalId === this._globalId) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    };
    
// ==============================
// * Private Properties
// ==============================
    
    // Save Info
    $._realFileName = $.Param.SVEX_saveName.replace(/ /g, "").toLowerCase();
    $._fileNameWidth = null; // The max width of the filename text on each save row
    $._fileNamePadding = 30; // The padding at the end of the File Name text
    $._rowPadding = 6; // The total amount of padding for the inner top and bottom of each save row
    $._autoTempDisable = null; // The timer for disabling the autosave function temporarily
    $._autoTempTime = 3000; // The time in miliseconds for disabling the autosave
    $._webScScale = 0.2; // The percentage that a web storage screenshot will be scaled down to
    // Warning Prompt Info
    $._loadWarning = false; // If the load warning is active
    $._recentSave = false; // If the game was saved / resets when the menu is closed
    $._promptMessage = ""; // The message to show in the prompt
    $._promptFade = false; // If the prompt scene should fade out on exit
    $._promptChoices = [$.Param.SVEX_okText, $.Param.SVEX_cancelText]; // The choices for the prompt
    $._promptCallback = null; // The callback function for the prompt
    
// ==============================
// * Private Methods
// ==============================
    
    /**
     * Saves the game.
     */
    $._autosave = function () {
        if ($._autoTempDisable !== null || !$.Param.SVEX_autosave) {
            return false;
        }
        if ($.Param.SVEX_enableSc) { SceneManager._makeNewScreenshot(); }
        
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame($.Param.SVEX_autosaveId)) {
            StorageManager.cleanBackup($.Param.SVEX_autosaveId);
        } else {
            console.warn("The autosave was unsuccessful. "
                + "Please check the list of known issues at the top of the plugin script.");
        }
    };
    
    $._preventAutosave = function () {
        $._autoTempDisable = setTimeout(function () {
                $._autoTempDisable = null;
            }, $._autoTempTime);
    };
    
    /**
     * Get an offset amount based on outer and inner heights.
     * @param {Number} outerHeight
     * @param {Number} innerHeight
     * @param {Bool} reverse If a reverse offset is needed
     * @returns {Number} The offset amount or 3 as a default
     */
    $._getAlignOffset = function (outerHeight, innerHeight, reverse) {
        if ($.Param.SVEX_itemAlign === "middle") {
            return (outerHeight - innerHeight) / 2;
        } else if ($.Param.SVEX_itemAlign === "bottom") {
            return (reverse) ? $._rowPadding / 2 : outerHeight - innerHeight;
        } else {
            return (reverse) ? outerHeight - innerHeight : $._rowPadding / 2;
        }
    };
    
    /**
     * Loads a screenshot from the local storage.
     * @param {String} filename The filename
     * @returns {Mixed} A Bitmap of the screenshot or null
     */
    $._loadLocalSc = function (filename) {
        // The date timestamp is used to force a refresh on the url
        return (filename !== null && $.Param.SVEX_enableSc)
            ? Bitmap.load($.Param.SVEX_imgDir + "/"
            + filename + "?" + new Date().getTime()) : null;
    };
    
    /**
     * Loads a screenshot from the local web storage.
     * @param {String} filename The filename
     * @param {Number} saveId The save file id
     * @returns {Mixed} A Bitmap of the screenshot or null
     */
    $._loadWebSc = function (filename, saveId) {
        if (filename === null) { return null; }
        
        filename = $._getWebFilename(filename, saveId) + "Img";
        var data = localStorage.getItem(filename);
        
        return (data !== null)
            ? Bitmap.load(LZString.decompressFromBase64(data)) : null;
    };
    
    /**
     * Saves data as compressed in the local web storage.
     * @param {String} filename The filename for the web storage key
     * @param {String} data The string of data to store
     */
    $._saveWebSc = function (filename, data) {
        localStorage.setItem($._getWebFilename(filename + "Img"),
            LZString.compressToBase64(data));
    };
    
    /**
     * Gets the adjusted filename key for web storage.
     * @param {String} filename The filename to adjust for web
     * @param {Number} savefileId The current save file id, can be omitted
     * @returns {String} The web filename key
     */
    $._getWebFilename = function (filename, savefileId) {
        if (!$dataSystem) { return filename; }
        
        if (savefileId === $.Param.SVEX_autosaveId && $.Param.SVEX_autosave) {
            filename = "autosave";
        } else if (savefileId !== undefined) {
            filename += savefileId;
        }
        
        return ($.Param.SVEX_webPrepend)
            ? $dataSystem.gameTitle.replace(/ /g, "") + filename : filename;
    };
    
    /**
     * Sets a warning prompt. Call with the scope needed for the callback function.
     * @param {String} msg The prompt message
     * @param {Function} cb The callback function for the prompt (bound to $._setWarning)
     * @param {Bool} fade If the prompt scene should fade out on confirmation
     */
    $._setWarning = function (msg, cb, fade) {
        $._promptMessage = msg;
        $._promptFade = fade || false;
        $._promptCallback = function (option) {
            if (option === 0) {
                // Confirmed
                $._preventAutosave(); // Temporarily prevent autosave
                cb.call(this);
            }
        }.bind(this);
        
        SceneManager.push(Scene_Prompt);
    };
    
    /**
     * Measures the width of the text.
     * @param {String} text The text to measure
     * @returns {Number} The width of the text
     */
    $._measureTextWidth = function (text) {
       var bmp = new Bitmap();
       var width = Math.ceil(bmp.measureTextWidth(text));
       bmp = null;
       return width;
    };
    
//=============================================================================
// New Classes
//=============================================================================

// ==============================
// * Window_Prompt
// ==============================
    
    // Allow a basic prompt window with message text, choices, and a callback function
    $$.Window_Prompt = function () {
        this.initialize.apply(this, arguments);
    };
    
    $$.Window_Prompt.prototype = Object.create(Window_Command.prototype);
    $$.Window_Prompt.prototype.constructor = $$.Window_Prompt;
    
    $$.Window_Prompt.prototype.initialize = function () {
        this._itemTextAlign = "center";
        this._cancelIndex = 1;
        this._windowWidth = $.Param.SVEX_boxWidth;
        this._cursorRectWidth = $.Param.SVEX_cursorWidth;
        this._fullPadding = this.textPadding() * 2;
        this.initMessageData();
        Window_Command.prototype.initialize.call(this, 0, 0);
    };
    $$.Window_Prompt.prototype.initMessageData = function () {
        this._message = $._promptMessage;
        this._messageOffset = 1;
        this._messageWidth = this.textWidthEx(this._message);
        this._messageHeight = this.lineHeight();
        this._messages = [];
        
        if (this._windowWidth > 0) {
            // Update data for custom prompt width
            var innerHeight = this._windowWidth - this._fullPadding;
            var messagePieces = this._message.split(" ");
            var newMessage = "";
            var text = "";
            var width = 0;

            // Split up the message into strings that will fit the window size
            for (var i = 0; i < messagePieces.length; i += 1) {
                text = (i === 0) ? messagePieces[i] : " " + messagePieces[i];
                if (this.textWidthEx(newMessage + text) > innerHeight
                        && newMessage !== "") {
                    // Finish the current message and start a new one
                    width = Math.max(width, this.textWidthEx(newMessage));
                    this._messages.push(newMessage);
                    newMessage = messagePieces[i];
                } else {
                    newMessage += text;
                }
            }
            if (newMessage.trim() !== "") { this._messages.push(newMessage); }
            // Update info for draw methods
            this._messageWidth = width;
            this._messageOffset = this._messages.length;
            this._messageHeight = this._messageOffset * this.lineHeight();
        }
    };
    // Create a bitmap based on the window width and height
    $$.Window_Prompt.prototype.createContents = function () {
        this.contents = new Bitmap(this.windowWidth(), this.windowHeight());
        this.resetFontSettings();
    };
    // Allow a start method for the window
    $$.Window_Prompt.prototype.start = function () {
        this.updatePlacement();
        this.setBackgroundType(0);
        this.refresh();
        this.selectDefault();
        this.open();
        this.activate();
    };
    // Allow for custom cursor selection width
    $.Window_Prompt_updateCursor = $$.Window_Prompt.prototype.updateCursor;
    $$.Window_Prompt.prototype.updateCursor = function() {
        var width = (this._cursorRectWidth > 0) ? this._cursorRectWidth : this.contents.width;
        var x = 0;
        if (this._cursorAll) {
            $.Window_Prompt_updateCursor.call(this);
        } else if (this.isCursorVisible()) {
            var rect = this.itemRect(this.index());
            x = (rect.width - width) / 2;
            this.setCursorRect(x, rect.y, width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    };
    // Allow the cancel default
    $$.Window_Prompt.prototype.selectDefault = function () {
        this.select(this._cancelIndex);
    };
    // Allow text align
    $$.Window_Prompt.prototype.updatePlacement = function () {
        var positionType = 1;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        switch (positionType) {
            case 0 :
                this.x = 0;
                this._itemTextAlign = "left";
                break;
            case 1 :
                this.x = (Graphics.boxWidth - this.width) / 2;
                this._itemTextAlign = "center";
                break;
            case 2 :
                this.x = Graphics.boxWidth - this.width;
                this._itemTextAlign = "right";
                break;
        }
        
        this.y = Math.max((Graphics.boxHeight - this.height) / 2, 0);
    };
    // Allow text align
    $$.Window_Prompt.prototype.itemTextAlign = function () {
        return this._itemTextAlign;
    };
    // Add the extra height for the text message
    $.Window_Prompt_windowHeight = $$.Window_Prompt.prototype.windowHeight;
    $$.Window_Prompt.prototype.windowHeight = function () {
        return $.Window_Prompt_windowHeight.call(this) + this._messageHeight;
    };
    // Allow max width based on choice and text message widths
    $$.Window_Prompt.prototype.windowWidth = function () {
        if (this._windowWidth > 0) {
            return this._windowWidth;
        } else {
            var choiceWidth = this.maxChoiceWidth();
            var width = Math.max(choiceWidth, this._messageWidth) + this.padding * 2;
            return Math.min(width, Graphics.boxWidth);
        }
    };
    // Allow the width to be based on the choices
    $$.Window_Prompt.prototype.maxChoiceWidth = function () {
        var maxWidth = 96;
        for (var i = 0; i < $._promptChoices.length; i++) {
            var choiceWidth = this.textWidthEx($._promptChoices[i]) + this._fullPadding;
            maxWidth = Math.max(maxWidth, choiceWidth);
        }
        return maxWidth;
    };
    // Use the custom text measure method
    $$.Window_Prompt.prototype.textWidthEx = function (text) {
        return $._measureTextWidth(text);
    };
    // Allow the contents height to be based on the maxItems and itemHeight
    $$.Window_Prompt.prototype.contentsHeight = function () {
        return this.maxItems() * this.itemHeight();
    };
    // Get the commands from the $._promptChoices
    $$.Window_Prompt.prototype.makeCommandList = function () {
        for (var i = 0; i < $._promptChoices.length; i++) {
            this.addCommand($._promptChoices[i], "choice");
        }
    };
    // Allow drawing of the text message along with the choices
    $$.Window_Prompt.prototype.drawAllItems = function () {
        var msg = this._messages;
        var msgLength = msg.length;
        var index = 0;
        
        for (var i = 0; i < this.maxPageItems(); i += 1) {
            // Use the message offset to determine the top index number
            index = this.topIndex() + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
        // Now draw the prompt message(s)
        if (msgLength > 0) {
            for (var i = 0; i < msgLength; i += 1) {
                this.drawMessageText(i, msg[i]);
            }
        } else {
            this.drawMessageText(0, this._message);
        }
    };
    $$.Window_Prompt.prototype.drawItem = function (index) {
        var text = this.commandName(index);
        var rect = this.itemRectForText(index);
        this.drawText(text, rect.x, rect.y, rect.width, this.itemTextAlign());
    };
    $$.Window_Prompt.prototype.drawMessageText = function (index, text) {
        // itemRectForText adds message offset, so remove it first
        var rect = this.itemRectForText(index - this._messageOffset);
        this.drawText(text, rect.x, rect.y, rect.width, this.itemTextAlign());
    };
    // Allow cancel
    $$.Window_Prompt.prototype.isCancelEnabled = function () {
        return true;
    };
    // Check for OK input
    $$.Window_Prompt.prototype.isOkTriggered = function () {
        return Input.isTriggered("ok");
    };
    // Set the OK and Cancel handlers to exit the prompt scene
    $$.Window_Prompt.prototype.callOkHandler = function () {
        var index = this.index();
        if (index === this._cancelIndex) {
            this.callCancelHandler();
        } else {
            this.callHandler("exit");
            $._promptCallback(index);
        }
    };
    $$.Window_Prompt.prototype.callCancelHandler = function () {
        $._promptFade = false;
        this.callHandler("exit");
        $._promptCallback(this._cancelIndex);
    };
    // Allow drawing of the text message rectangle along with the choice rectangles
    $$.Window_Prompt.prototype.itemRect = function (index) {
        index += this._messageOffset;
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };
    $$.Window_Prompt.prototype.itemRectForText = function (index) {
        var rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this._fullPadding;
        return rect;
    };
    
// ==============================
// * Scene_Prompt
// ==============================
    
    // Allow a basic scene to handle the prompt window
    $$.Scene_Prompt = function () {
        this.initialize.apply(this, arguments);
    };
    
    $$.Scene_Prompt.prototype = Object.create(Scene_MenuBase.prototype);
    $$.Scene_Prompt.prototype.constructor = $$.Scene_Prompt;
    
    $$.Scene_Prompt.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    // Allow the command window to be created
    $$.Scene_Prompt.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
    };
    // Allow the command window to be closed
    $$.Scene_Prompt.prototype.stop = function () {
        Scene_MenuBase.prototype.stop.call(this);
        this._commandWindow.close();
    };
    // Allow a new background for the scene
    $$.Scene_Prompt.prototype.createBackground = function () {
        Scene_MenuBase.prototype.createBackground.call(this);
        this.setBackgroundOpacity(128);
    };
    // Create the command window as a new Window_Prompt
    $$.Scene_Prompt.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_Prompt();
        this._commandWindow.setHandler("exit", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
        this._commandWindow.start();
    };
    // Allow scene fade out if needed
    $$.Scene_Prompt.prototype.popScene = function () {
        if ($._promptFade) { this.fadeOutAll(); }
        Scene_MenuBase.prototype.popScene.call(this);
    };
    
}(JavaHut.SaveEx, this)); // Send in global object (this) for new classes