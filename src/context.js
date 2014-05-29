
var shortener = {
  init: function() {
    this.api_endpoint = 'http://api.longurl.org/v2/'
    this.popup = '#chrome-ext-unshortener-popup'
    this.loadSupportedServices()
    this.bindEventListeners()  
  },
  loadSupportedServices: function() {
    var supportedServices = localStorage.getItem('supportedServices')
    if (supportedServices) {
      this.supportedServices = supportedServices 
    } else {
      this.getServicesFromAPI()  
    }  
  },
  bindEventListeners: function() {
    $(this.popup).on('click', '.close_frame', this.hidePopup.bind(this))
  },
  getServicesFromAPI:function() {
    $.ajax({
      method:   'GET',
      url:      this.api_endpoint + 'services?format=json&user-agent=chrome-unshortener',
      success:  this.saveSupportedServices
    })
  },
  saveSupportedServices: function(response) {
    this.supportedServices = response
    localStorage.setItem('supportedServices', response)    
  },
  getInfo: function(url) {
    $.ajax({
        method:   'GET',
        context:  this,
        url:      this.api_endpoint + 'expand?format=json&user-agent=chrome-unshortener&title=1&url=' + encodeURIComponent(url)
      })
      .done(function(response) {
        this.processResponse(response)
      })
      .fail(function(response){
        this.hidePopup()
      })
  },
  processResponse: function(response) {      
      var result = ''

      if (typeof(response.title) !== 'undefined') {
        result = '<strong>Long url: </strong>' + response.title
      }

      if (typeof(response['long-url']) !== 'undefined' ) {
        result += '<br><strong>Visit: </strong><a href=' + response['long-url'] + '>' + response['long-url'] + '</a>'
      }
      this.displayResult(result)
  },
  displayResult: function(result) {
    $(this.popup).find('p').html(result)
    setTimeout(this.hidePopup, 5000)
  },
  hidePopup: function() {
    $(this.popup).remove()
  }
}

shortener.init()

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.data) {
      var data = request.data;
      shortener.getInfo(data.linkUrl)
      $(shortener.popup).remove()

      var html = [
        '<div id="chrome-ext-unshortener-popup">',
        '<p>Loading...</p>',
        '<button class="close_frame" title="close">Close</button>',
        '</div>'
      ].join('\n')

      $('body').append(html)
    }

  });