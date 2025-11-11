
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, User, ArrowLeft, Info } from "lucide-react";

const StudentEmbargoNotice = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const embargoInfo = {
    releaseDate: "Thursday, 15th August 2024",
    releaseTime: "9:00 AM",
    currentDate: new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowLoginForm(false)}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>
              Enter your credentials to check result status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student ID / UPN</label>
              <input
                type="text"
                placeholder="Enter your student ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="w-full">
              Check Results Status
            </Button>
            <div className="text-center text-sm text-gray-600">
              <p>Forgot your password? <span className="text-blue-600 cursor-pointer">Contact school office</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl mb-4">Results Under Embargo</CardTitle>
            <CardDescription className="text-lg">
              Your examination results will be available on
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="text-center bg-blue-50 p-6 rounded-lg">
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                {embargoInfo.releaseDate}
              </h2>
              <p className="text-xl text-gray-700">at {embargoInfo.releaseTime}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Results are currently under embargo as per exam board regulations. You will receive an 
                email notification when your results become available.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center mb-4">What to expect:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Digital Statement</h4>
                  <p className="text-sm text-gray-600">View and download your official results</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Next Steps Guide</h4>
                  <p className="text-sm text-gray-600">Information about university, college, and career options</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-6">
              <Button 
                onClick={() => setShowLoginForm(true)}
                className="px-8"
              >
                Student Login
              </Button>
              <Button variant="outline" className="px-8">
                Parent/Guardian Access
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600 pt-4 border-t">
              <p>Need help? Contact our school office:</p>
              <p className="font-medium">Phone: 01234 567890 | Email: results@school.edu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentEmbargoNotice;
