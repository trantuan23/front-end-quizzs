"use client";

const Footer = () => {
  return (
    <footer className=" to-blue-600 text-white w-full shadow-lg fixed bottom-0 left-0 bg-gradient-to-br py-4 mt-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Quiz Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
