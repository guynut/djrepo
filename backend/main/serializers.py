from rest_framework import serializers
from .models import *


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'resume']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'school_name', 'degree', 'start_date', 'end_date', 'description']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'location']


class PreviousJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviousJob
        fields = '__all__'


class PreviousJobDetailSerializer(serializers.ModelSerializer):
    """Read-only nested serializer for resume detail."""
    company = CompanySerializer(read_only=True)

    class Meta:
        model = PreviousJob
        fields = ['id', 'company', 'position', 'start_date', 'end_date', 'description']


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'


class ResumeListSerializer(serializers.ModelSerializer):
    """List view: title, summary, skills for card display."""
    title = serializers.CharField(source='owner.username', read_only=True)
    summary = serializers.CharField(source='success_summary', read_only=True)
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = ['id', 'title', 'summary', 'skills', 'created_at', 'updated_at']


class ResumeDetailSerializer(serializers.ModelSerializer):
    """Detail view: full resume with education, jobs, and average rating."""
    title = serializers.CharField(source='owner.username', read_only=True)
    summary = serializers.CharField(source='success_summary', read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    previous_jobs = PreviousJobDetailSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'summary', 'skills', 'education', 'previous_jobs',
            'average_rating', 'profile_image', 'created_at', 'updated_at'
        ]

    def get_average_rating(self, obj):
        from django.db.models import Avg
        result = obj.ratings.aggregate(avg=Avg('score'))
        return round(result['avg'], 1) if result['avg'] is not None else None
