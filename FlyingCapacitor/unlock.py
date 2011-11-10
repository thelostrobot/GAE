from BeautifulSoup import BeautifulSoup as bs
import wsgiref.handlers
import urllib2
from urllib2 import urlopen
import urlparse
from urllib import urlretrieve
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
    
    
    
class MyHandler(webapp.RequestHandler):
    def get(self):
        page= str(self.request.get("page"))
        self.response.out.write(template.render("unlock.html",''))
        
    def post(self):            
        '''self.response.out.write(template.render("main.html",''))'''
        try:
            soup = bs(urlopen('http://dynamic.xkcd.com/random/comic/'))
            parsed = list(urlparse.urlparse('http://dynamic.xkcd.com/random/comic/'))            
            for image in soup.findAll("img"):
                  if image["src"].lower().startswith("http://imgs.xkcd.com/comics/"):
                    self.response.out.write(image)
        
        except urllib2.HTTPError, error:
                self.response.out.write('/images/noimage.png')


         
class Fun(webapp.RequestHandler):
    def get(self):
        self.response.out.write(template.render("fun.html",''))
                 
        
class GetImage(webapp.RequestHandler):
    def get(self):
        url = self.request.get('u')
        if (url):
            try:
                response = urllib2.urlopen(url)
                the_page = response.read() 
            except urllib2.HTTPError, error:
                   the_page = error.read()
           
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
    apps_binding.append(('/Fun', Fun))
    application = webapp.WSGIApplication(apps_binding, debug=True)
    wsgiref.handlers.CGIHandler().run(application)
    
    
if __name__ == "__main__":
    main()        