"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Star,
  MessageSquare,
  Send,
  Search,
  CheckCircle,
  Reply,
  Flag,
  Share2,
  Download,
  BarChart3,
  ThumbsUp,
} from "lucide-react"

interface Review {
  id: number
  patient_name: string
  patient_avatar?: string
  rating: number
  comment: string
  date: string
  helpful_count?: number
  response?: {
    text: string
    date: string
  }
  tags?: string[]
  verified_patient: boolean
  status: "published" | "pending" | "flagged"
}

interface ReviewsManagementProps {
  doctorId: string
  reviews: Review[]
  onResponseSubmit: (reviewId: number, response: string) => void
}

export function ReviewsManagement({ doctorId, reviews, onResponseSubmit }: ReviewsManagementProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [responseText, setResponseText] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)

  const filteredReviews = reviews.filter((review) => {
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
    const matchesStatus = filterStatus === "all" || review.status === filterStatus
    const matchesSearch =
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.patient_name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRating && matchesStatus && matchesSearch
  })

  const handleResponseSubmit = () => {
    if (selectedReview && responseText.trim()) {
      onResponseSubmit(selectedReview.id, responseText.trim())
      setResponseText("")
      setIsResponseDialogOpen(false)
      setSelectedReview(null)
    }
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
    ))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Опубликован</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">На модерации</Badge>
      case "flagged":
        return <Badge className="bg-red-100 text-red-800">Помечен</Badge>
      default:
        return null
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 : 0,
  }))

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего отзывов</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средняя оценка</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ответов дано</p>
                <p className="text-2xl font-bold">{reviews.filter((r) => r.response).length}</p>
              </div>
              <Reply className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Процент ответов</p>
                <p className="text-2xl font-bold">
                  {reviews.length > 0
                    ? Math.round((reviews.filter((r) => r.response).length / reviews.length) * 100)
                    : 0}
                  %
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Управление отзывами</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Поиск по отзывам..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Фильтр по рейтингу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все оценки</SelectItem>
                    <SelectItem value="5">5 звезд</SelectItem>
                    <SelectItem value="4">4 звезды</SelectItem>
                    <SelectItem value="3">3 звезды</SelectItem>
                    <SelectItem value="2">2 звезды</SelectItem>
                    <SelectItem value="1">1 звезда</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="published">Опубликованные</SelectItem>
                    <SelectItem value="pending">На модерации</SelectItem>
                    <SelectItem value="flagged">Помеченные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.patient_avatar || "/placeholder.svg"} alt={review.patient_name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {review.patient_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{review.patient_name}</p>
                          {review.verified_patient && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Проверен
                            </Badge>
                          )}
                          {getStatusBadge(review.status)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!review.response && (
                        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReview(review)}>
                              <Reply className="w-4 h-4 mr-1" />
                              Ответить
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Ответ на отзыв</DialogTitle>
                              <DialogDescription>
                                Отвечайте на отзыв от {selectedReview?.patient_name}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedReview && (
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">{renderStars(selectedReview.rating)}</div>
                                    <span className="text-sm text-muted-foreground">{selectedReview.patient_name}</span>
                                  </div>
                                  <p className="text-sm">{selectedReview.comment}</p>
                                </div>

                                <div>
                                  <Label htmlFor="response">Ваш ответ</Label>
                                  <Textarea
                                    id="response"
                                    placeholder="Напишите ваш ответ пациенту..."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    rows={4}
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                            )}

                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                                Отмена
                              </Button>
                              <Button onClick={handleResponseSubmit} disabled={!responseText.trim()}>
                                <Send className="w-4 h-4 mr-2" />
                                Отправить ответ
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700">{review.comment}</p>

                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {review.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {review.response && (
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-l-blue-400">
                        <div className="flex items-center gap-2 mb-2">
                          <Reply className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Ваш ответ</span>
                          <span className="text-xs text-blue-600">
                            {new Date(review.response.date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">{review.response.text}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          <ThumbsUp className="w-4 h-4 inline mr-1" />
                          Полезно: {review.helpful_count || 0}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение оценок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{rating}</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-amber-400 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground ml-1">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Тренды по месяцам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>График трендов будет доступен после накопления данных</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки отзывов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Автоматические уведомления</p>
                  <p className="text-sm text-muted-foreground">Получать уведомления о новых отзывах</p>
                </div>
                <Button variant="outline">Настроить</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Модерация отзывов</p>
                  <p className="text-sm text-muted-foreground">Проверять отзывы перед публикацией</p>
                </div>
                <Button variant="outline">Настроить</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Шаблоны ответов</p>
                  <p className="text-sm text-muted-foreground">Создать шаблоны для быстрых ответов</p>
                </div>
                <Button variant="outline">Управлять</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
