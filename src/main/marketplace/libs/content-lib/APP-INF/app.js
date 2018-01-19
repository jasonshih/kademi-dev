controllerMappings.addComponent("content/components", "socialLinks", "html", "Displays the social links", "Content App component");
controllerMappings.addComponent("content/components", "errorDetails", "html", "Displays detailed error page", "Content App component");
controllerMappings.addComponent("content/components", "htmlPanel", "html", "Displays panel with text and icon", "Content App component");
controllerMappings.addComponent("content/components", "showHideButton", "html", "A button which causes all following content to be initially hidden, and is only shown when clicked", "Content App component");
controllerMappings.addComponent("content/components", "rating", "html", "Shows a rating stars which is predefined by admin", "Content App component");
controllerMappings.addComponent("content/components", "tile", "html", "Shows a tile which contains image, text and link", "Content App component");

// Asset stuff
controllerMappings.addComponent("content/components", "assetQueryList", "html", "Shows a list of assets from an asset query", "Content App component");
controllerMappings.addComponent("content/components", "dynamicMediaAsset", "html", "Displays media evaluated dynamically", "Content App component");
controllerMappings.addComponent("content/components", "photo")
        .addType("html")
        .desc("Photo block")
        .categories("Content App component")
        .addDefaultAtt("photo-src", "/static/images/somewhere_bangladesh.jpg")
        .addDefaultAtt("photo-align", "left")
        .addDefaultAtt("photo-valign", "")
        .addDefaultAtt("photo-style", "")
        .addDefaultAtt("photo-responsive", "")
        .addDefaultAtt("photo-width", "500")
        .addDefaultAtt("photo-height", "336")
        .addDefaultAtt("photo-alt", "")
        .addDefaultAtt("photo-linkable", "false")
        .addDefaultAtt("photo-link", "")
        .addDefaultAtt("photo-link-target", "")
        .build();

controllerMappings.addComponent("content/components", "assetQueryText", "html", "Displays text assets from a query", "Content App component");

// controllerMappings.addComponent("content/components", "video")
//         .addType("html")
//         .desc("Video block")
//         .categories("Content App component")
//         .addDefaultAtt("video-src", "/theme/apps/content/kademi-video.mp4")
//         .addDefaultAtt("video-auto-start", "false")
//         .addDefaultAtt("video-ratio", "4:3")
//         .addDefaultAtt("video-repeat", "false")
//         .addDefaultAtt("video-controls", "true")
//         .addDefaultAtt("video-border", "")
//         .addDefaultAtt("video-border-width", "")
//         .addDefaultAtt("video-border-color", "")
//         .addDefaultAtt("video-border-style", "");