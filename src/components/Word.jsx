import '../css/Word.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import axios from 'axios'

function Word() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const categoryName = location.state?.categoryName || '';
  const [categoryData, setCategoryData] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchCategoryWords = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories/${categoryId}`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.request(config);

        if (response.data && response.data.succeeded) {
          setCategoryData(response.data.data);
          setWords(response.data.data.words || []);
        } else {
          setError('Failed to fetch category data');
        }
      } catch (err) {
        console.error('Error fetching category words:', err);
        setError('Failed to load words for this category');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryWords();
    }
  }, [categoryId]);

  const filteredWords = words.filter(word => {
    const matchesSearch = word.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && word.published) ||
      (filterStatus === 'unpublished' && !word.published);
    return matchesSearch && matchesStatus;
  });

  const publishedCount = words.filter(word => word.published).length;
  const unpublishedCount = words.filter(word => !word.published).length;

  const handleBackToCategories = () => {
    navigate('/categories');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading words...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={handleBackToCategories}
            className="mb-8 flex items-center text-gray-300 hover:text-white transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </button>
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-300 mb-2">Error Loading Words</h2>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    /*header*/
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToCategories}
                className="mr-4 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
              <div>
                <h1 className="text-xl font-bold text-white">{categoryName || categoryData?.name}</h1>
                <p className="text-sm text-gray-400">{words.length} words total</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400 text-sm">{publishedCount} published</span>
              <span className="text-yellow-400 text-sm">{unpublishedCount} unpublished</span>
            </div>
          </div>
        </div>
      </header>
      {/*word section*/}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {categoryName || categoryData?.name} Words
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore all words in this category. Use the search and filters below to find specific content.
          </p>
        </div>

        {/*search&filter*/}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/*searchbar*/}
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            />
          </div>
          {/*filter*/}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          >
            <option value="all" className="bg-gray-800">All Words</option>
            <option value="published" className="bg-gray-800">Published Only</option>
            <option value="unpublished" className="bg-gray-800">Unpublished Only</option>
          </select>
        </div>

        {/*stats*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{words.length}</p>
                <p className="text-gray-400 text-sm">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{publishedCount}</p>
                <p className="text-gray-400 text-sm">Published</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{unpublishedCount}</p>
                <p className="text-gray-400 text-sm">Draft</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{filteredWords.length}</p>
                <p className="text-gray-400 text-sm">Filtered</p>
              </div>
            </div>
          </div>
        </div>

        {/*words/layout*/}
        {filteredWords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWords.map((word, index) => (
              <div
                key={word.id}
                className="group transform hover:scale-105 transition duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition duration-300 h-full flex flex-col">
                  {/*word*/}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition duration-300 flex-1">
                      {word.name}
                    </h3>
                    {/*status of published*/}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${word.published
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                      {word.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/*descrip*/}
                  {word.description && (
                    <p className="text-gray-400 text-sm mb-4 flex-grow">
                      {word.description}
                    </p>
                  )}

                  {/*id*/}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-3">
                    <span>ID: {word.id}</span>
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition duration-300">
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-white transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No words found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'This category doesn\'t contain any words yet'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Word;