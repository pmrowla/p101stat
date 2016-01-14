// place any jQuery/helper plugins in here, instead of separate, slower script files.
$('#myTabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
