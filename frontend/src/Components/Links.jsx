import React, { useState, useEffect } from 'react';
import { GetLinks } from '../service/api';
import NavBar from './NavBar';
import QRCode from 'qrcode.react';
// import { link } from '../../../backend/routes';

function Links() {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getLinks = async () => {
    const uid = localStorage.getItem('uid');
    const data = { data: uid };
    try {
      const response = await GetLinks(data);
      setLinks(response.links);
      // console.log(response.links)
      // console.log(response.links[0].downloadCount)
      setFilteredLinks(response.links); // Initialize filtered links with all links
    } catch (error) {
      console.log('Error while calling the API', error.message);
    }
  };

  useEffect(() => {
    getLinks();
  }, []);

  useEffect(() => {
    // Filter links based on search term whenever it changes
    const filtered = links.filter(link =>
      link.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLinks(filtered);
  }, [searchTerm, links]);

  const copyTextToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    });
  };

  // Placeholder for download counts (assuming each link object has a 'downloads' property)
  const renderDownloadCount = (link) => {
    return (
      <div className="text-sm text-gray-600">Downloads: {
    }</div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-300">
      <NavBar />
      <div className="text-orange-800 m-8 flex flex-col items-center flex-grow">
        <h2 className="text-3xl font-bold mb-8">Your Links</h2>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by file name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 mb-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
        />
        {links.length?<>
        <div className="grid gap-8 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl">
          {filteredLinks.map((file, index) => (
            <div
              key={index}
              className="bg-yellow-200 shadow-lg rounded-lg p-6 mb-4 transition-transform transform hover:scale-105"
            >
              <div className="text-xl font-medium text-black mb-2 truncate">{file.name}</div>
              <div className="flex items-center mb-4">
                <span className="text-md font-medium text-black break-all">
                  http://localhost:8080/api/v1/file/{file._id}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() =>
                    copyTextToClipboard(`http://localhost:8080/api/v1/file/${file._id}`, index)
                  }
                  className={`px-4 py-2 rounded-full transition duration-300 shadow-lg text-xs ${
                    copiedIndex === index
                      ? 'bg-orange-600 text-white animate-tick'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-800 hover:to-orange-800'
                  }`}
                >
                  {copiedIndex === index ? '✓ Copied' : 'Copy'}
                </button>
                <div className="p-2 bg-white rounded-lg">
                  <QRCode value={`http://localhost:8080/api/v1/file/${file._id}`} size={128} />
                </div>
              </div>
              {/* {renderDownloadCount(index)} */}
              <div className="text-sm text-gray-600">Downloads: {file.downloadCount}
              </div>
            </div>
          ))}
        </div>
        </>:<>
        <h1 className='text-black animate-tic'>No links </h1></>}
      </div>
    </div>
  );
}

export default Links;
