import { useState, useEffect } from 'react';
import { Trash2, Plus, Eye, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import {
  Card,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useDatabase } from '../../hooks/useDatabase';
import { BlogPost, BlogPostTranslation, BlogCategory, supabaseAPI } from '../../data/supabase';
import { toast } from 'sonner';
import { ImageUpload } from '../../components/ImageUpload';
import { BlogContentSection, SectionType } from '../../components/admin/BlogContentSection';

export function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsNames, setPostsNames] = useState<Record<string, string>>({});
  const [categoriesNames, setCategoriesNames] = useState<Record<string, string>>({});
  const [postsCategories, setPostsCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<BlogPostTranslation>({
    post_id: '',
    language: 'es',
    title: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });
  const [contentSections, setContentSections] = useState<{
    id: string;
    type: SectionType;
    content: string;
    title?: string;
    order: number;
    headingLevel?: 1 | 2 | 3 | 4;
  }[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('none');
  const { updateTrigger } = useDatabase();

  useEffect(() => {
    loadPosts();
    loadBlogCategories();
  }, [updateTrigger]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await supabaseAPI.getBlogPosts();
      setPosts(data);

      const names: Record<string, string> = {};
      const postCategories: Record<string, string> = {};
      
      for (const post of data) {
        const translation = await supabaseAPI.getBlogPostTranslation(post.id, currentLang);
        names[post.id] = translation.title || post.slug;
        
        // Obtener categoría del artículo
        const relations = await supabaseAPI.getBlogPostCategories(post.id);
        if (relations.length > 0) {
          postCategories[post.id] = relations[0].category_id;
        }
      }
      
      setPostsNames(names);
      setPostsCategories(postCategories);
    } catch (error) {
      toast.error('Error al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  const loadBlogCategories = async () => {
    try {
      const categories = await supabaseAPI.getBlogCategories('active');
      setBlogCategories(categories);

      const names: Record<string, string> = {};
      for (const category of categories) {
        const translation = await supabaseAPI.getBlogCategoryTranslation(category.id, currentLang);
        names[category.id] = translation.name || category.slug;
      }
      setCategoriesNames(names);
    } catch (error) {
    }
  };

  const loadSelectedCategory = async (postId: string) => {
    try {
      const relations = await supabaseAPI.getBlogPostCategories(postId);
      if (relations.length > 0) {
        setSelectedCategory(relations[0].category_id);
      } else {
        setSelectedCategory('none');
      }
    } catch (error) {
      setSelectedCategory('none');
    }
  };

  const handleNewPost = () => {
    const newPost: BlogPost = {
      id: '',
      slug: '',
      author: '',
      cover_image: '',
      status: 'draft',
      featured: false,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: 'article',
    };
    
    const newTranslation: BlogPostTranslation = {
      post_id: '',
      language: currentLang,
      title: '',
      excerpt: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    };
    
    setEditingPost(newPost);
    setEditingTranslation(newTranslation);
    setContentSections([createNewSection()]);
    setSelectedCategory('none');
    setDialogOpen(true);
  };

  const handleEdit = async (post: BlogPost) => {
    setEditingPost(post);
    const translation = await supabaseAPI.getBlogPostTranslation(post.id, currentLang);
    setEditingTranslation(translation);
    
    // Parse existing content into sections
    const sections = parseContentToSections(translation.content);
    setContentSections(sections);
    
    // Load selected category
    await loadSelectedCategory(post.id);
    
    setDialogOpen(true);
  };

  const createNewSection = (type: SectionType = 'text'): {
    id: string;
    type: SectionType;
    content: string;
    title?: string;
    order: number;
    headingLevel?: 1 | 2 | 3 | 4;
  } => ({
    id: Math.random().toString(36).substr(2, 9),
    type,
    content: '',
    title: '',
    order: contentSections.length,
    headingLevel: 2,
  });

  const parseContentToSections = (html: string): {
    id: string;
    type: SectionType;
    content: string;
    title?: string;
    order: number;
    headingLevel?: 1 | 2 | 3 | 4;
  }[] => {
    if (!html) return [createNewSection()];
    
    // Simple parser to convert HTML content into sections
    const sections: { id: string; type: SectionType; content: string; title?: string; order: number; headingLevel?: 1 | 2 | 3 | 4 }[] = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const elements = tempDiv.children;
    let index = 0;
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4') {
        // Heading with following content
        const heading = element.textContent || '';
        const nextElement = elements[i + 1];
        const headingLevel = parseInt(element.tagName.substring(1)) as 1 | 2 | 3 | 4;
        
        if (nextElement && (nextElement.tagName === 'P' || nextElement.tagName === 'UL' || nextElement.tagName === 'OL')) {
          sections.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            title: heading,
            content: nextElement.outerHTML,
            order: index++,
            headingLevel,
          });
          i++; // Skip next element since we included it
        } else {
          sections.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            title: heading,
            content: '',
            order: index++,
            headingLevel,
          });
        }
      } else if (element.tagName === 'P') {
        // Single paragraph
        sections.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          content: element.outerHTML,
          order: index++,
        });
      } else if (element.tagName === 'IMG') {
        // Image
        sections.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          content: element.getAttribute('src') || '',
          order: index++,
        });
      } else if (element.tagName === 'BLOCKQUOTE') {
        // Quote
        sections.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'quote',
          content: element.textContent || '',
          title: element.getAttribute('cite') || '',
          order: index++,
        });
      } else if (element.tagName === 'UL') {
        // Regular unordered list (treat as text section)
        sections.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          content: element.outerHTML,
          order: index++,
        });
      } else if (element.tagName === 'OL') {
        // Ordered list (treat as text section)
        sections.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          content: element.outerHTML,
          order: index++,
        });
      }
    }
    
    return sections.length > 0 ? sections : [createNewSection()];
  };

  const generateHTMLFromSections = (sections: { id: string; type: SectionType; content: string; title?: string; order: number; headingLevel?: 1 | 2 | 3 | 4 }[]): string => {
    return sections.map(section => {
      switch (section.type) {
        case 'text':
          const headingLevel = section.headingLevel || 2;
          return section.title ? `
            <h${headingLevel}>${section.title}</h${headingLevel}>
            ${section.content}
          ` : section.content;
          
        case 'image':
          return `<img src="${section.content}" alt="Section image" class="w-full h-auto rounded-lg shadow-md">`;
          
        case 'video':
          return `<video src="${section.content}" controls class="w-full h-auto rounded-lg shadow-md"></video>`;
          
        case 'quote':
          return `<blockquote class="border-l-4 border-[#19FF00] pl-4 italic text-[#629960]">
            ${section.content}
            ${section.title ? `<cite class="not-italic block mt-2 text-sm">— ${section.title}</cite>` : ''}
          </blockquote>`;
          
        case 'gallery':
          const images = section.content.split(',').map(url => url.trim()).filter(url => url);
          return `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${images.map(url => `<img src="${url}" alt="Gallery image" class="w-full h-48 object-cover rounded-lg shadow-md">`).join('')}
          </div>`;
          
        default:
          return '';
      }
    }).join('');
  };

  const handleAddSection = (type: SectionType = 'text') => {
    const newSection = createNewSection(type);
    setContentSections([...contentSections, newSection]);
  };

  const handleUpdateSection = (updatedSection: { id: string; type: SectionType; content: string; title?: string; order: number; headingLevel?: 1 | 2 | 3 | 4 }) => {
    setContentSections(prev => prev.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    ));
  };

  const handleDeleteSection = (id: string) => {
    if (contentSections.length > 1) {
      setContentSections(prev => prev.filter(section => section.id !== id));
    } else {
      toast.warning('Debe haber al menos una sección de contenido');
    }
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    const index = contentSections.findIndex(section => section.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < contentSections.length) {
      const newSections = [...contentSections];
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      
      // Update order properties
      setContentSections(newSections.map((section, idx) => ({
        ...section,
        order: idx,
      })));
    }
  };

  const handleSave = async () => {
    if (!editingPost || !editingTranslation) return;

    const finalSlug = editingPost.slug || 
                      editingTranslation.title.toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]+/g, '');

    if (!finalSlug) {
      toast.error('El título o el slug son obligatorios');
      return;
    }

    // Generate content from sections
    const generatedContent = generateHTMLFromSections(contentSections);
    const updatedTranslation = {
      ...editingTranslation,
      content: generatedContent,
    };

    setLoading(true);

    try {
      let postId = editingPost.id;

      const postData = {
        slug: finalSlug,
        author: editingPost.author,
        cover_image: editingPost.cover_image,
        status: editingPost.status,
        featured: editingPost.featured || false,
        type: editingPost.type,
      };

      if (!postId) {
        const createdPost = await supabaseAPI.createBlogPost(postData);
        postId = createdPost.id;
      } else {
        await supabaseAPI.updateBlogPost(postId, postData);
      }

      await supabaseAPI.updateBlogPostTranslation(postId, currentLang, {
        ...updatedTranslation,
        post_id: postId,
        language: currentLang,
      });

      // Update category
      const currentRelations = await supabaseAPI.getBlogPostCategories(postId);
      
      // Remove all existing categories
      for (const relation of currentRelations) {
        await supabaseAPI.removeBlogPostCategory(postId, relation.category_id);
      }
      
      // Add selected category (si no es "Sin categoría")
      if (selectedCategory && selectedCategory !== 'none') {
        await supabaseAPI.addBlogPostCategory(postId, selectedCategory);
      }

      toast.success(editingPost.id ? 'Artículo actualizado' : 'Artículo creado');
      setDialogOpen(false);
      loadPosts();
    } catch (error: any) {
      
      if (error.message?.includes('duplicate key')) {
        toast.error('El slug ya existe. Por favor usa un título diferente.');
      } else {
        toast.error('Error al guardar: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      await supabaseAPI.deleteBlogPost(postToDelete);
      toast.success('Artículo eliminado correctamente');
      loadPosts();
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar artículo');
    }
  };

  const getPostCategoryName = (postId: string) => {
    const categoryId = postsCategories[postId];
    if (!categoryId || categoryId === 'none') return 'Sin categoría';
    
    return categoriesNames[categoryId] || 'Categoría desconocida';
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl text-[#1C5D15] mb-2">Gestión de Artículos</h2>
          <p className="text-[#629960]">Administra los artículos del blog</p>
        </div>
        <Button className="bg-[#1C5D15] text-white hover:bg-[#629960]" onClick={handleNewPost}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 bg-white border-2 border-[#629960]/20">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.slug}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1C5D15] to-[#629960]"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl text-[#1C5D15] mb-1">{postsNames[post.id] || post.slug}</h3>
                  <p className="text-sm text-[#629960]">Categoría: {getPostCategoryName(post.id)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={
                    post.status === 'published'
                      ? 'bg-[#19FF00] text-[#1C5D15]'
                      : 'bg-[#629960] text-white'
                  }
                >
                  {post.status}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#629960] text-[#629960]"
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1C5D15] text-[#1C5D15]"
                  onClick={() => handleEdit(post)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost?.id ? 'Editar Artículo' : 'Nuevo Artículo'}</DialogTitle>
          </DialogHeader>

          {editingPost && editingTranslation && (
            <div className="space-y-6">
              <div>
                <Label>Categoría</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value: string) => setSelectedCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría</SelectItem>
                    {blogCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {categoriesNames[category.id] || category.slug}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Idioma</Label>
                <Select
                  value={currentLang}
                  onValueChange={async (val: 'es' | 'en') => {
                    setCurrentLang(val);
                    if (editingPost) {
                      const translation = await supabaseAPI.getBlogPostTranslation(editingPost.id, val);
                      setEditingTranslation(translation);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Slug</Label>
                <Input
                  value={editingPost.slug}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, slug: e.target.value })
                  }
                  placeholder="slug-del-articulo"
                />
              </div>

              <div>
                <Label>Imagen de Portada</Label>
                <ImageUpload
                  currentImage={editingPost.cover_image || ''}
                  onImageUpload={(url) => setEditingPost({ ...editingPost, cover_image: typeof url === 'string' ? url || '' : url[0] || '' })}
                />
              </div>

              <div>
                <Label>Título</Label>
                <Input
                  value={editingTranslation.title}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Extracto</Label>
                <Textarea
                  value={editingTranslation.excerpt}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, excerpt: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Contenido del Artículo</Label>
                  <Select onValueChange={(value) => handleAddSection(value as SectionType)}>
                    <SelectTrigger className="w-32">
                      <Plus className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Agregar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="quote">Cita</SelectItem>
                      <SelectItem value="gallery">Galería</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {contentSections.map((section, index) => (
                    <BlogContentSection
                      key={section.id}
                      section={section}
                      onUpdate={handleUpdateSection}
                      onDelete={handleDeleteSection}
                      onMoveUp={() => handleMoveSection(section.id, 'up')}
                      onMoveDown={() => handleMoveSection(section.id, 'down')}
                      canMoveUp={index > 0}
                      canMoveDown={index < contentSections.length - 1}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Autor</Label>
                <Input
                  value={editingPost.author}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, author: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select
                  value={editingPost.status}
                  onValueChange={(val: 'draft' | 'published') =>
                    setEditingPost({ ...editingPost, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo</Label>
                <Select
                  value={editingPost.type}
                  onValueChange={(val: 'article' | 'news') =>
                    setEditingPost({ ...editingPost, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Artículo</SelectItem>
                    <SelectItem value="news">Noticia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Destacado</Label>
                <Select
                  value={editingPost.featured ? '1' : '0'}
                  onValueChange={(val: '1' | '0') =>
                    setEditingPost({ ...editingPost, featured: val === '1' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Título Meta (SEO)</Label>
                <Input
                  value={editingTranslation.meta_title}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, meta_title: e.target.value })
                  }
                  placeholder="Título para motores de búsqueda"
                />
              </div>

              <div>
                <Label>Descripción Meta (SEO)</Label>
                <Input
                  value={editingTranslation.meta_description}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, meta_description: e.target.value })
                  }
                  placeholder="Descripción para motores de búsqueda"
                />
              </div>

              <div>
                <Label>Palabras Clave Meta (SEO)</Label>
                <Input
                  value={editingTranslation.meta_keywords}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, meta_keywords: e.target.value })
                  }
                  placeholder="palabra1, palabra2, palabra3"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-[#1C5D15] text-white">
              {editingPost?.id ? 'Guardar Cambios' : 'Crear Artículo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}