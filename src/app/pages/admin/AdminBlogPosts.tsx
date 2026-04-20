import { useState, useEffect } from 'react';
import { Trash2, Plus, Eye, Edit, BookOpen, Sparkles, Layout } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { useDatabase } from '../../hooks/useDatabase';
import { BlogPost, supabaseAPI } from '../../data/supabase';
import { toast } from 'sonner';

export function AdminBlogPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsNames, setPostsNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { updateTrigger } = useDatabase();

  useEffect(() => {
    loadPosts();
  }, [updateTrigger]);

  const loadPosts = async () => {
    try {
      const data = await supabaseAPI.getBlogPosts();
      setPosts(data);

      const names: Record<string, string> = {};
      for (const post of data) {
        // We just need a title for the list, can use a quick fetch or just the slug
        names[post.id] = post.slug; // Simplified for now, the editor handles translations
      }
      setPostsNames(names);
    } catch (error) {
      toast.error('Error al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = async () => {
    try {
      setLoading(true);
      const newPost: Partial<BlogPost> = {
        slug: `draft-post-${Date.now()}`,
        status: 'draft',
        author: 'Admin',
        type: 'article',
        featured: false
      };
      const created = await supabaseAPI.createBlogPost(newPost);
      navigate(`/admin/visual-editor/blog/${created.id}`);
    } catch (e) {
      toast.error('Error al crear borrador');
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    navigate(`/admin/visual-editor/blog/${post.id}`);
  };

  const handleDelete = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await supabaseAPI.deleteBlogPost(postToDelete);
      toast.success('Artículo eliminado correctamente');
      loadPosts();
    } catch (error) {
      toast.error('Error al eliminar artículo');
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="p-4 md:p-6 text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C5D15] mx-auto mb-4"></div>
        <p className="text-[#629960] font-bold uppercase text-[10px] tracking-widest">Cargando blog...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#1C5D15] tracking-tight">Gestión de Artículos</h2>
          <p className="text-[#629960]">Administra los artículos y noticias del blog</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#1C5D15] text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white"
            onClick={() => navigate('/admin/blog/categories')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Categorías
          </Button>
          <Button className="bg-[#1C5D15] text-white hover:text-[#1C5D15]" onClick={handleNewPost}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Artículo
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 bg-white border-2 border-[#1C5D15]/10 hover:border-[#19FF00]/30 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#1C5D15]/5">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1C5D15] to-[#629960]/20 flex items-center justify-center">
                       <Layout className="w-6 h-6 text-white/50" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1C5D15] mb-1">{post.slug}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={post.status === 'published' ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-gray-100 text-gray-500'}>
                      {post.status.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-[#629960] font-bold uppercase tracking-widest">{post.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#629960]/20 text-[#629960]"
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  className="bg-[#1C5D15] text-white hover:bg-[#629960]"
                  onClick={() => handleEdit(post)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Editor Visual
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-100 text-red-400 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
