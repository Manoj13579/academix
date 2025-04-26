import logo from "../../assets/logo.png"

const Footer = () => {
  return (
  <footer className="bg-fuchsia-500 md:px-36 text-left w-full">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-12 py-10 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={logo} alt="logo" className="w-20 h-6"/>
          <p className="mt-6 text-center md:text-left text-sm text-white/80 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus vero ut amet nostrum quasi id cumque optio ipsam aliquid ?
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h1 className="font-semibold text-white mb-5">Company</h1>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
          <li><a href="#"></a>Home</li>
          <li><a href="#"></a>About</li>
          <li><a href="#"></a>Contact</li>
          <li><a href="#"></a>Privacy Policy</li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">Subscribe to our newsletter</h2>
          <p className="text-sm text-white/80">latest news, articles, and resources sent to your inbox weekly</p>
          <div className="flex items-center pt-4 gap-2">
            <input type="text"
            required
            placeholder="Enter your email" 
            className="border border-gray-500/30 bg-gray-100 text-gray-500 placeholder:text-gray-500 outline-none w=64 h-9 rounded px-2 text-sm" />
            <button className="bg-cyan-500 w-24 h-9 text-white rounded cursor-pointer">Subscribe</button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white/60">Copyright 2025 &copy; Manoj. All rights reserved </p>
    </footer>
  )
}

export default Footer
