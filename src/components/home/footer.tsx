"use client";

const Footer = () => {
  return (
    <footer className="bg-black w-full fixed bottom-0 left-0 text-white py-4 mt-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Quiz Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
