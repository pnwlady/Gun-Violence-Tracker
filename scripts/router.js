page('/',function() {
  page.redirect('/intl');
});
page('/us', index.unitedStatesMap);
page('/us/*', index.unitedStatesSpecificMap);
page('/intl', index.internationalMap);
page.start();
