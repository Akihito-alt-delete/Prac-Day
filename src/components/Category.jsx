import '../css/Category.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    import('axios').then(({ default: axios }) => {
      axios.request(config)
        .then((response) => {
          setCategories(Array.isArray(response.data.data) ? response.data.data : []);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/categories/${categoryId}/words`, {
      state: { categoryName }
    });
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/*header*/}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToHome}
                className="mr-4 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
              <h1 className="text-xl font-bold text-white">Categories</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">{categories.length} categories</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Content Categories
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore and organize your content by categories. Click on any category to view its words.
          </p>
        </div>

        {/*searchbar*/}
        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            />
          </div>
        </div>

        {/*loading_state*/}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/*grid*/}
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category, index) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id, category.name)}
                    className="group cursor-pointer transform hover:scale-105 transition duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition duration-300 h-full flex flex-col">
                      {/*icons*/}
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>

                      {/*name*/}
                      <h3 className="text-xl font-bold text-white text-center mb-3 group-hover:text-purple-300 transition duration-300">
                        {category.name}
                      </h3>

                      {/*descrip*/}
                      <p className="text-gray-400 text-center text-sm mb-4 flex-grow">
                        Explore words and content in this category
                      </p>

                      {/*-> icon*/}
                      <div className="flex justify-center">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition duration-300">
                          <svg className="w-4 h-4 text-gray-300 group-hover:text-white transform group-hover:translate-x-1 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /*if null*/
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">No categories found</h3>
                <p className="text-gray-400">
                  {searchTerm ? `No categories match "${searchTerm}"` : 'No categories available'}
                </p>
              </div>
            )}
          </>
        )}

        {/*footer&stats*/}
        {!loading && categories.length > 0 && (
          <div className="mt-16 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-purple-400">{categories.length}</p>
                <p className="text-gray-400">Total Categories</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-400">{filteredCategories.length}</p>
                <p className="text-gray-400">Filtered Results</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">100%</p>
                <p className="text-gray-400">Accessibility</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Category;