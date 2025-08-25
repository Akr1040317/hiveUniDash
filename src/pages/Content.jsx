
import React, { useState, useEffect } from 'react';
import { Content as ContentEntity, Quiz } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Eye, BookOpen, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContentPage() {
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');
  const [content, setContent] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  // Content form state
  const [contentForm, setContentForm] = useState({
    title: '',
    description: '',
    type: 'lesson',
    status: 'draft'
  });
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    quizName: '',
    type: 'spelling',
    numberOfWords: 100,
    image: '',
    words: [''],
    userGroups: ['admin', 'userTier0', 'userTier1', 'userTier2', 'userTier3', 'userTier1AE']
  });
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentRegion]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [contentData, quizzesData] = await Promise.all([
        ContentEntity.filter({ region: currentRegion }),
        Quiz.filter({ region: currentRegion })
      ]);
      setContent(contentData);
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newContent = await ContentEntity.create({
        ...contentForm,
        region: currentRegion
      });
      setContent([newContent, ...content]);
      setContentForm({ title: '', description: '', type: 'lesson', status: 'draft' });
      setIsContentDialogOpen(false);
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      const quizData = {
        ...quizForm,
        words: quizForm.words.filter(word => word.trim() !== ''),
        userGroups: quizForm.userGroups.filter(group => group.trim() !== '')
      };

      if (editingQuiz) {
        await Quiz.update(editingQuiz.id, quizData);
        setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...editingQuiz, ...quizData } : q));
        setEditingQuiz(null);
      } else {
        const newQuiz = await Quiz.create(quizData);
        setQuizzes([newQuiz, ...quizzes]);
      }

      setQuizForm({
        quizName: '',
        type: 'spelling',
        numberOfWords: 100,
        image: '',
        words: [''],
        userGroups: ['admin', 'userTier0', 'userTier1', 'userTier2', 'userTier3', 'userTier1AE']
      });
      setIsQuizDialogOpen(false);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      quizName: quiz.quizName || '',
      type: quiz.type || 'spelling',
      numberOfWords: quiz.numberOfWords || 100,
      image: quiz.image || '',
      words: quiz.words && quiz.words.length > 0 ? quiz.words : [''],
      userGroups: quiz.userGroups && quiz.userGroups.length > 0 ? quiz.userGroups : ['admin', 'userTier0', 'userTier1', 'userTier2', 'userTier3', 'userTier1AE']
    });
    setIsQuizDialogOpen(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await Quiz.delete(quizId);
        setQuizzes(quizzes.filter(q => q.id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const addWord = () => {
    setQuizForm({ ...quizForm, words: [...quizForm.words, ''] });
  };

  const removeWord = (index) => {
    const newWords = quizForm.words.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, words: newWords });
  };

  const updateWord = (index, value) => {
    const newWords = [...quizForm.words];
    newWords[index] = value;
    setQuizForm({ ...quizForm, words: newWords });
  };

  const addUserGroup = () => {
    setQuizForm({ ...quizForm, userGroups: [...quizForm.userGroups, ''] });
  };

  const removeUserGroup = (index) => {
    const newGroups = quizForm.userGroups.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, userGroups: newGroups });
  };

  const updateUserGroup = (index, value) => {
    const newGroups = [...quizForm.userGroups];
    newGroups[index] = value;
    setQuizForm({ ...quizForm, userGroups: newGroups });
  };

  const regionInfo = {
    us: { name: "United States", color: "bg-blue-400" },
    dubai: { name: "UAE Prepcenter", color: "bg-amber-400" }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-3 h-3 rounded-full ${regionInfo[currentRegion].color}`} />
            <h1 className="text-3xl font-bold text-white">
              {regionInfo[currentRegion].name} Content Management
            </h1>
          </div>
          <p className="text-gray-400">
            Manage your content and quizzes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="content" className="data-[state=active]:bg-gray-700">
            <FileText className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="data-[state=active]:bg-gray-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Quizzes
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Content Library</h2>
            <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Content
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Content</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleContentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Title</Label>
                    <Input
                      id="title"
                      value={contentForm.title}
                      onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={contentForm.description}
                      onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type" className="text-gray-300">Type</Label>
                      <Select value={contentForm.type} onValueChange={(value) => setContentForm({ ...contentForm, type: value })}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="lesson">Lesson</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select value={contentForm.status} onValueChange={(value) => setContentForm({ ...contentForm, status: value })}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsContentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                      Create Content
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <Card key={item.id} className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="text-xs capitalize bg-blue-500/20 text-blue-300 border-blue-500/30"
                    >
                      {item.type}
                    </Badge>
                    <Badge 
                      variant={item.status === 'published' ? 'default' : 'secondary'}
                      className={`text-xs capitalize ${
                        item.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {content.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-lg">No content available</p>
                <p className="text-sm">Create your first piece of content to get started</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Quiz Management</h2>
              <p className="text-sm text-gray-400 mt-1">Showing only quizzes with userTier1AE access</p>
            </div>
            <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleQuizSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quizName" className="text-gray-300">Quiz Name</Label>
                      <Input
                        id="quizName"
                        value={quizForm.quizName}
                        onChange={(e) => setQuizForm({ ...quizForm, quizName: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-gray-300">Type</Label>
                      <Select value={quizForm.type} onValueChange={(value) => setQuizForm({ ...quizForm, type: value })}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="spelling">Spelling</SelectItem>
                          <SelectItem value="vocabulary">Vocabulary</SelectItem>
                          <SelectItem value="grammar">Grammar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numberOfWords" className="text-gray-300">Number of Words</Label>
                      <Input
                        id="numberOfWords"
                        type="number"
                        value={quizForm.numberOfWords}
                        onChange={(e) => setQuizForm({ ...quizForm, numberOfWords: parseInt(e.target.value) })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="image" className="text-gray-300">Image URL</Label>
                      <Input
                        id="image"
                        value={quizForm.image}
                        onChange={(e) => setQuizForm({ ...quizForm, image: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Words</Label>
                    <div className="space-y-2">
                      {quizForm.words.map((word, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={word}
                            onChange={(e) => updateWord(index, e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder={`Word ${index + 1}`}
                            required
                          />
                          {quizForm.words.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeWord(index)}
                              className="text-red-400 border-red-400 hover:bg-red-400/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addWord}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Word
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">User Groups</Label>
                    <div className="space-y-2">
                      {quizForm.userGroups.map((group, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={group}
                            onChange={(e) => updateUserGroup(index, e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="User group"
                            required
                          />
                          {quizForm.userGroups.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeUserGroup(index)}
                              className="text-red-400 border-red-400 hover:bg-red-400/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addUserGroup}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User Group
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsQuizDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                      {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{quiz.quizName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quiz.image && (
                    <div className="w-full h-32 bg-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={quiz.image} 
                        alt={quiz.quizName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className="text-xs capitalize bg-purple-500/20 text-purple-300 border-purple-500/30"
                      >
                        {quiz.type}
                      </Badge>
                      <span className="text-sm text-gray-400">{quiz.numberOfWords} words</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Words: {quiz.words ? quiz.words.length : 0}</p>
                      <p>User Groups: {quiz.userGroups ? quiz.userGroups.length : 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuiz(quiz)}
                      className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {quizzes.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-lg">No quizzes available</p>
                <p className="text-sm">Create your first quiz to get started</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
