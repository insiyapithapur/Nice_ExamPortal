# Generated by Django 5.1.3 on 2024-12-04 09:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('faculty', '0006_studentexaminfo_form'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentexaminfo',
            name='form',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='faculty.form'),
        ),
    ]