import '../css/Footer.css'

function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-div">
            <div className="mx-auto px-6 py-8">

              <div className="flex flex-col md:flex-row justify-between items-center">

                <div className="flex items-center space-x-6 mb-3 md:mb-0">
                  <a href="#" className="footer-link transition-colors">Instagram</a>
                  <a href="#" className="footer-link transition-colors">LinkedIn</a>
                </div>

                <div className="flex items-center space-x-2">
                  <span className='right'>© 2025 TodayIFeel. All rights reserved. Made by</span>
                  <span className=" text-red-500 font-semibold">Ta2wall</span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
export default Footer