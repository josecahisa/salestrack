# Generated by Django 2.2.3 on 2020-04-11 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_product_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='free_accesories',
            field=models.IntegerField(default=0, verbose_name='Cant Accesorios Incluidos'),
        ),
        migrations.AddField(
            model_name='product',
            name='is_accesory',
            field=models.BooleanField(default=False, verbose_name='Es Accesorio'),
        ),
        migrations.AlterField(
            model_name='product',
            name='provider_alpha_code',
            field=models.CharField(max_length=20, verbose_name='Codigo Maquina'),
        ),
        migrations.AlterField(
            model_name='product',
            name='provider_code',
            field=models.CharField(max_length=20, verbose_name='Codigo'),
        ),
    ]
