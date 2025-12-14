import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Upload, CheckCircle, AlertTriangle, Droplets, Zap, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { categoryConfig, type IssueCategory } from '@/data/issues';

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  category: z.enum(['road', 'garbage', 'water', 'electricity', 'safety']),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must be less than 500 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters').max(200, 'Location must be less than 200 characters'),
});

type ReportFormData = z.infer<typeof reportSchema>;

const categoryIcons: Record<IssueCategory, typeof MapPin> = {
  road: AlertTriangle,
  garbage: Trash2,
  water: Droplets,
  electricity: Zap,
  safety: Shield,
};

const ReportSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: "Issue Reported Successfully! 🎉",
      description: "Thank you for contributing to a better Nepal. Your report has been submitted.",
    });

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      reset();
      setSelectedCategory(null);
    }, 3000);
  };

  const handleCategorySelect = (category: IssueCategory) => {
    setSelectedCategory(category);
    setValue('category', category);
  };

  if (isSuccess) {
    return (
      <section id="report" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center"
          >
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your issue has been reported successfully. Our team will review it shortly.
            </p>
            <Badge variant="resolved" className="text-base px-4 py-2">
              Report ID: UPY-{Math.random().toString(36).substr(2, 8).toUpperCase()}
            </Badge>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="report" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            Citizen Reporting
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Report an Urban Issue
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us identify problems in your neighborhood. Your report contributes to 
            building a smarter, safer city.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Card glass className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                New Issue Report
              </CardTitle>
              <CardDescription>
                Fill in the details below to submit your report. All fields are required.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Select Category</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const IconComponent = categoryIcons[key as IssueCategory];
                      const isSelected = selectedCategory === key;
                      
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleCategorySelect(key as IssueCategory)}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-200
                            flex flex-col items-center gap-2 hover:shadow-md
                            ${isSelected 
                              ? 'border-primary bg-primary/5 shadow-md' 
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <span className="text-2xl">{config.icon}</span>
                          <span className="text-xs font-medium">{config.label}</span>
                          <span className="text-[10px] text-muted-foreground">{config.labelNp}</span>
                          {isSelected && (
                            <motion.div
                              layoutId="selected-category"
                              className="absolute inset-0 border-2 border-primary rounded-xl"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Large pothole on main road"
                    {...register('title')}
                    className="h-12"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the issue. Include relevant details like size, severity, and any immediate dangers..."
                    rows={4}
                    {...register('description')}
                    className="resize-none"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., Near Balkhu Bridge, Ring Road, Kathmandu"
                      {...register('location')}
                      className="h-12 pl-10"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                {/* Image Upload (Visual only - no actual upload) */}
                <div className="space-y-2">
                  <Label>Attach Image (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop an image or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ReportSection;
