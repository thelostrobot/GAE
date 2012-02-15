#!/usr/bin/env python
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db


class Shout(db.Model):
    comment = db.StringProperty(required=False)
    author = db.StringProperty(required=False)
    when = db.DateTimeProperty(auto_now_add=True)
    

class MyHandler(webapp.RequestHandler):
    def get(self):
        shouts = db.GqlQuery('Select * from Shout ORDER BY when')
        
        values = {                  
            'shouts': shouts        
        }
        
        self.response.out.write(template.render('main.html',values))
        
    def post(self):
        shout = Shout(author = self.request.get('author'),comment=self.request.get('comment'))  
        shout.put()
        self.redirect('/')
        
def main():
    app = webapp.WSGIApplication([(r'.*',MyHandler)], debug=True)
    wsgiref.handlers.CGIHandler().run(app)     
    
    
if __name__ == "__main__":
   main()