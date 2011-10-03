import wsgiref.handlers
import urllib2
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
    
    
    
class MyHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write(template.render("unlock.html",''))
        
    def post(self):    
         self.response.out.write(template.render("main.html",''))
        
class GetImage(webapp.RequestHandler):
    def get(self):
        url = self.request.get('u')
        if (url):
           response = urllib2.urlopen(url)
           the_page = response.read() 
           self.response.headers['Content-Type'] = 'image/jpeg'
           self.response.out.write(the_page)
           ''' self.response.headers['Content-Type'] = 'image/jpeg' '''
            
        else:
            self.redirect('noimage.png')        
        
def main():
    '''app = webapp.WSGIApplication([(r'.*',MyHandler)], debug=True)
    wsgiref.handlers.CGIHandler().run(app)'''
    apps_binding = []
    apps_binding.append(('.',MyHandler))   
    apps_binding.append(('/image', GetImage))
    application = webapp.WSGIApplication(apps_binding, debug=True)
    wsgiref.handlers.CGIHandler().run(application)
    
    
if __name__ == "__main__":
    main()        