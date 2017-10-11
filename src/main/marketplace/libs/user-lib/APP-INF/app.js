controllerMappings.addQuery("/APP-INF/queries/registrationsOverTime.query.json", ["signuplog"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/membersTable.query.json", ["profile"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/membersTableAll.query.json", ["profile"], ["ReportsViewer"]);

controllerMappings.addComponent("user/components", "recentUserRegistrations", "html", "Display recent registrations", "User App component");
controllerMappings.addComponent("user/components", "recentActiveUsers", "html", "Display recent active users", "User App component");
controllerMappings.addComponent("user/components", "registrationsOverTime", "html", "Display a line graph of registrations over time", "User App component");
controllerMappings.addComponent("user/components", "membersTable", "html", "Display a table of members", "User App component");