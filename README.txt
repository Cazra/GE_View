README
========

/* 
 @preserve Copyright (c) 2014 Stephen "Cazra" Lindberg

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 The Software shall be used for Good, not Evil.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/

GE_View is a simple API for creating and managing Google Earth visualizations.
Each KML object created with a GE_View is given a unique ID for easy and fast
access to it, and factory APIs are provided to simplify creating various 
KML elements for a Google Earth application.


Requirements:
----------------
GE_View requires the following to run:
* A Javascript-enabled web browser with the Google Earth plugin installed.


Running the sandbox page:
----------------
To run the sandbox GE_View page (GE_View.html), just start an HTTP server
in the root directory of this project and open it in your browser. In
addition to serving as an example of how to create a GE_View application, the 
GE_View.html creates a global GE_View object which you can use to add elements
to the visualization using the API. This should be useful for learning the 
GE_View API and for testing future extensions of the API.


Enjoy!
