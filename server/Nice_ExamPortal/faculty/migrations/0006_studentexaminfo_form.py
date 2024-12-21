# Generated by Django 5.1.3 on 2024-12-04 08:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('faculty', '0005_studentexaminfo_checked'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentexaminfo',
            name='form',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='faculty.form'),
            preserve_default=False,
        ),
    ]
