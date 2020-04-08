# Generated by Django 2.2.3 on 2019-12-13 12:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_auto_20191211_2249'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='business_unit',
            options={'verbose_name': 'Unidad de Negocio', 'verbose_name_plural': 'Unidades de Negocio'},
        ),
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name': 'Categoría', 'verbose_name_plural': 'Categorias'},
        ),
        migrations.AlterModelOptions(
            name='classification',
            options={'verbose_name': 'Clasificación', 'verbose_name_plural': 'Clasificaciones'},
        ),
        migrations.RenameField(
            model_name='brand',
            old_name='Nombre',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='business_unit',
            old_name='Nombre',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='category',
            old_name='Nombre',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='classification',
            old_name='Nombre',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Descripcion',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Codigo Alfanumérico',
            new_name='provider_alpha_code',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Codigo del Proveedor',
            new_name='provider_code',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Estado',
            new_name='status',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Precio Mayorista',
            new_name='wholesale_price',
        ),
    ]
