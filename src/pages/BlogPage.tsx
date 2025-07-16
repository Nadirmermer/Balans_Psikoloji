import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, ArrowRight } from 'lucide-react';
import { useBlogYazilar } from '../hooks/useBlogYazilar';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { blogYazilar, loading, error } = useBlogYazilar();

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Blog yazıları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Hata: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-sage-600 text-white px-4 py-2 rounded-lg"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Kategorileri dinamik olarak oluştur
  const categories = [
    { id: 'all', name: 'Tüm Yazılar', count: blogYazilar.length },
    ...Array.from(new Set(blogYazilar.map(yazi => yazi.kategori)))
      .filter(Boolean)
      .map(kategori => ({
        id: kategori,
        name: kategori.charAt(0).toUpperCase() + kategori.slice(1),
        count: blogYazilar.filter(yazi => yazi.kategori === kategori).length
      }))
  ];

  const filteredPosts = blogYazilar.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.kategori === selectedCategory;
    const matchesSearch = post.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.ozet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.etiketler.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogYazilar[0];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-ocean-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-sage-900 mb-6">
              Ruh Sağlığı Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uzman psikologlarımızdan ruh sağlığı, kişisel gelişim ve yaşam kalitesini artıracak bilgilendirici yazılar.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-sage-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-sage-100'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featuredPost && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-sage-900 mb-8">Öne Çıkan Yazı</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src={featuredPost.resim}
                  alt={featuredPost.baslik}
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-warmth-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Öne Çıkan
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(featuredPost.created_at).toLocaleDateString('tr-TR')}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredPost.okuma_suresi} dk okuma</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-sage-900 mb-4">
                  {featuredPost.baslik}
                </h3>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {featuredPost.ozet}
                </p>
                
                <div className="flex items-center mb-6">
                  <User className="w-4 h-4 text-sage-500 mr-2" />
                  {featuredPost.yazar && (
                    <Link
                      to={`/uzman/${featuredPost.yazar.slug}`}
                      className="text-sage-600 hover:text-sage-700 font-medium"
                    >
                      {featuredPost.yazar.ad} {featuredPost.yazar.soyad}
                    </Link>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.etiketler.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <span>Yazıyı Okuyun</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-sage-900 mb-8">
            {selectedCategory === 'all' ? 'Tüm Yazılar' : `${categories.find(c => c.id === selectedCategory)?.name} Yazıları`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(featuredPost ? 1 : 0).map((yazi) => (
              <Link
                key={yazi.id}
                to={`/blog/${yazi.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={yazi.resim}
                    alt={yazi.baslik}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    {yazi.kategori && (
                      <span className="bg-ocean-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {categories.find(c => c.id === yazi.kategori)?.name}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(yazi.created_at).toLocaleDateString('tr-TR')}</span>
                    <span className="mx-2">•</span>
                    <span>{yazi.okuma_suresi} dk</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-sage-900 mb-3 line-clamp-2">
                    {yazi.baslik}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {yazi.ozet}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <User className="w-4 h-4 text-sage-500 mr-2" />
                    {yazi.yazar && (
                      <span className="text-sm text-sage-600">
                        {yazi.yazar.ad} {yazi.yazar.soyad}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {yazi.etiketler.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-sage-100 text-sage-700 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                Aradığınız kriterlere uygun yazı bulunamadı.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-sage-600 to-ocean-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Yeni Yazılarımızdan Haberdar Olun
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Uzman psikologlarımızdan ruh sağlığı konusunda güncel bilgileri e-posta ile alın.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="w-full px-6 py-3 rounded-l-lg border-none focus:ring-2 focus:ring-warmth-500 focus:outline-none"
            />
            <button className="w-full sm:w-auto bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-3 rounded-r-lg font-semibold transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;