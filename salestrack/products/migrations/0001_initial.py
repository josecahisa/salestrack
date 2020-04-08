# Generated by Django 2.2.8 on 2019-12-11 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Descripcion', models.CharField(blank=True, max_length=100, null=True, verbose_name='Descripcion')),
                ('Estado', models.CharField(choices=[('A', 'Activo'), ('B', 'Borrado')], default='A', max_length=1, verbose_name='Estado')),
                ('Precio Mayorista', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=12, null=True, verbose_name='Precio Mayorista')),
                ('Codigo Alfanumérico', models.CharField(max_length=10, verbose_name='Codigo Alfanúmerico del Proveedor')),
                ('Codigo del Proveedor', models.CharField(max_length=10, verbose_name='Codigo del Proveedor')),
            ],
        ),
    ]
