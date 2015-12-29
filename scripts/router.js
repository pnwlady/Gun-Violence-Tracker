page('/',function() {
  page.redirect('/intl');
});
page('/us/*', index.unitedStatesSpecificMap);
page('/us', index.unitedStatesMap);
page('/intl', index.internationalMap);
page.start();
