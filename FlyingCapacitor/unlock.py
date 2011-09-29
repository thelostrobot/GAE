import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
    
    
    
class MyHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write(template.render("unlock.html",''))
        
    def post(self):    
         self.response.out.write(template.render("main.html",''))
        
def main():
    app = webapp.WSGIApplication([(r'.*',MyHandler)], debug=True)
    wsgiref.handlers.CGIHandler().run(app)
    
if __name__ == "__main__":
    main()        