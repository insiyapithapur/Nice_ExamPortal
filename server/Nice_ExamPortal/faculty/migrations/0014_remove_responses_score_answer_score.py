# Generated by Django 5.1.3 on 2024-12-21 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('faculty', '0013_studentexaminfo_total_score'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='responses',
            name='score',
        ),
        migrations.AddField(
            model_name='answer',
            name='score',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
