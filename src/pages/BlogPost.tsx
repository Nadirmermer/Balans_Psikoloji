import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Heart, BookOpen, ArrowRight, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useBlogYazilar } from '../hooks/useBlogYazilar';
import { createSanitizedHTML } from '../lib/sanitize';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogYazilar, getBlogYaziBySlug, loading, error } = useBlogYazilar();

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Blog yazısı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Hata: {error}</p>
          <Link to="/blog" className="text-sage-600 hover:text-sage-700">
            Blog sayfasına dönün
          </Link>
        </div>
      </div>
    );
  }

  const post = getBlogYaziBySlug(slug || '');

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-900 mb-4">Blog Yazısı Bulunamadı</h1>
          <Link to="/blog" className="text-sage-600 hover:text-sage-700">
            Blog sayfasına dönün
          </Link>
        </div>
      </div>
    );
  }

  // İlgili yazıları bul (aynı kategori veya aynı yazar)
  const relatedPosts = blogYazilar
    .filter(yazi => 
      yazi.id !== post.id && 
      (yazi.kategori === post.kategori || yazi.yazar_id === post.yazar_id)
    )
    .slice(0, 2);

  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Back Button */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-sage-600 hover:text-sage-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Blog Sayfasına Dön
          </Link>
        </div>
      </div>

      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          
          {/* Article Header */}
          <div className="px-8 py-12 text-center border-b border-gray-200">
            <div className="mb-6">
              {post.kategori && (
                <span className="bg-ocean-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {post.kategori.charAt(0).toUpperCase() + post.kategori.slice(1)}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-sage-900 mb-8 leading-tight">
              {post.baslik}
            </h1>
            
            {/* Author Info */}
            {post.yazar && (
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={post.yazar.profil_resmi}
                    alt={`${post.yazar.ad} ${post.yazar.soyad}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <Link
                    to={`/uzman/${post.yazar.slug}`}
                    className="text-sage-600 hover:text-sage-700 font-semibold"
                  >
                    {post.yazar.ad} {post.yazar.soyad}
                  </Link>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{post.okuma_suresi} dk okuma</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {post.etiketler.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative">
            <img
              src={post.resim}
              alt={post.baslik}
              className="w-full h-96 object-cover"
            />
            
            {/* Sticky Social Share */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <div className="flex flex-col space-y-2">
                  <button className="p-2 text-sage-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-sage-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-sage-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-sage-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="px-8 py-12">
            <div className="max-w-3xl mx-auto">
              {/* Özet */}
              {post.ozet && (
                <div className="bg-sage-50 border-l-4 border-sage-500 p-6 mb-8">
                  <p className="text-lg text-sage-800 font-medium italic">
                    {post.ozet}
                  </p>
                </div>
              )}
              
              {/* İçerik */}
              <div 
                className="prose prose-lg prose-sage max-w-none
                  prose-headings:text-sage-900 prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:text-gray-700 prose-li:mb-2
                  prose-a:text-sage-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-sage-700
                  prose-blockquote:border-l-4 prose-blockquote:border-sage-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-sage-700
                  prose-strong:text-sage-800 prose-strong:font-semibold
                  dark:prose-headings:text-sage-100 dark:prose-p:text-gray-300 dark:prose-ul:text-gray-300 
                  dark:prose-a:text-sage-400 dark:hover:prose-a:text-sage-300 dark:prose-blockquote:text-sage-300
                  dark:prose-strong:text-sage-200"
                dangerouslySetInnerHTML={createSanitizedHTML(post.icerik)}
              />
            </div>
          </div>

          {/* Mobile Social Share */}
          <div className="px-8 py-6 border-t border-gray-200 lg:hidden">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm text-gray-600 mr-2">Paylaş:</span>
              <button className="p-2 text-sage-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 text-sage-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 text-sage-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-2 text-sage-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Author Bio */}
          <div className="px-8 py-8 bg-cream-50 border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
              {post.yazar && (
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={post.yazar.profil_resmi}
                      alt={`${post.yazar.ad} ${post.yazar.soyad}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">
                      <Link
                        to={`/uzman/${post.yazar.slug}`}
                        className="hover:text-sage-700 transition-colors"
                      >
                        {post.yazar.ad} {post.yazar.soyad}
                      </Link>
                    </h3>
                    <p className="text-ocean-600 font-medium mb-2">{post.yazar.unvan}</p>
                    <p className="text-gray-600 text-sm mb-3">
                      {post.yazar.hakkinda ? post.yazar.hakkinda.substring(0, 150) + '...' : 'Bu yazının yazarı hakkında daha fazla bilgi almak için profil sayfasını ziyaret edin.'}
                    </p>
                    <div className="flex space-x-4">
                      <Link
                        to={`/uzman/${post.yazar.slug}`}
                        className="text-sage-600 hover:text-sage-700 text-sm font-medium"
                      >
                        Profili Görüntüle →
                      </Link>
                      <Link
                        to={`/randevu?uzman=${post.yazar.slug}`}
                        className="text-warmth-600 hover:text-warmth-700 text-sm font-medium"
                      >
                        Randevu Al →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-8 py-8 bg-gradient-to-br from-sage-600 to-ocean-600 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Profesyonel Destek Alın
            </h3>
            <p className="text-sage-100 mb-6 max-w-2xl mx-auto">
              Bu konuda uzman desteği almak isterseniz, deneyimli psikologlarımızdan randevu alabilirsiniz.
            </p>
            <Link
              to="/randevu"
              className="bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Randevu Al
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-sage-900 mb-8">İlgili Yazılar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost, index: number) => (
                <Link
                  key={index}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedPost.resim}
                      alt={relatedPost.baslik}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(relatedPost.created_at).toLocaleDateString('tr-TR')}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{relatedPost.okuma_suresi} dk</span>
                    </div>
                    <h3 className="text-xl font-semibold text-sage-900 group-hover:text-sage-700 transition-colors flex items-center">
                      {relatedPost.baslik}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{relatedPost.ozet}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;