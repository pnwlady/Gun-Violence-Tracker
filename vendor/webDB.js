var webDB = {};
webDB.sqlResult = null;

webDB.verbose = function (verbose) {
  var msg;
  if (verbose) {
    html5sql.logInfo = true;
    html5sql.logErrors = true;
    html5sql.putSelectResultsInArray = true;
    msg = 'html5sql verbosity on';
  } else {
    html5sql.logInfo = false;
    html5sql.logErrors = false;
    html5sql.putSelectResultsInArray = false;
    msg = 'html5sql verbosity off';
  }
  console.log(msg);
};

webDB.init = function() {
  // Open and init DB
  try {
    if (openDatabase) {
      webDB.verbose(true);
      webDB.connect('gbt', 'violence tracker database', 5*1024*1024);
      webDB.setupTables();
    } else {
      console.log('Web Databases not supported.');
    }
  } catch (e) {
    console.error('Error occured during DB init. Web Database may not be supported.');
  }
};

webDB.connect = function (database, title, size) {
  html5sql.openDatabase(database, title, size);
};

webDB.setupTables = function () {
  html5sql.process(
    'CREATE TABLE IF NOT EXISTS stateAbbreviations (name VARCHAR(255) NOT NULL, abbreviation VARCHAR(255) NOT NULL);',
    // 'CREATE TABLE IF NOT EXISTS congressContact (id INTEGER PRIMARY KEY, sortname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, link VARCHA(255) NOT NULL);',
    function() {
      // on success
      console.log('Success setting up table 1.');
    }
  );
  html5sql.process(
    // 'CREATE TABLE IF NOT EXISTS stateAbbreviations (id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, abbreviation VARCHAR(255) NOT NULL);',
    'CREATE TABLE IF NOT EXISTS congressContact (id INTEGER PRIMARY KEY, sortname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, link VARCHA(255) NOT NULL);',
    function() {
      // on success
      console.log('Success setting up table 2.');
    }
  );
};

webDB.execute = function (sql, callback) {
  callback = callback || function() {};
  html5sql.process(
    sql,
    function (tx, result, resultArray) {
      callback(resultArray);
    }
  );
};

webDB.reconnect = function() {
  // reconnect to DB
  try {
    if (openDatabase) {
      webDB.verbose(true);
      webDB.connect('gbt', 'violence tracker database', 5*1024*1024);
      //webDB.setupTables();
    } else {
      console.log('Web Databases not supported.');
    }
  } catch (e) {
    console.error('Error occured during DB init. Web Database may not be supported.');
  }
};

webDB.init();
